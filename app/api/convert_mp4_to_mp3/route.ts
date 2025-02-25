import { NextRequest, NextResponse } from "next/server";

const CLOUDCONVERT_API_KEY = process.env.CLOUDCONVERT_API_KEY;
const CLOUDCONVERT_API_URL = process.env.CLOUDCONVERT_API_URL;

if (!CLOUDCONVERT_API_KEY || !CLOUDCONVERT_API_URL) {
  throw new Error("Missing CloudConvert API credentials. Check environment variables.");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Convert File to Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Step 1: Create Conversion Job
    const jobResponse = await fetch(`${CLOUDCONVERT_API_URL}/v2/jobs`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CLOUDCONVERT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tasks: {
          import: { operation: "import/upload" },
          convert: {
            operation: "convert",
            input: ["import"],
            output_format: "mp3",
          },
          export: {
            operation: "export/url",
            input: ["convert"],
          },
        },
      }),
    });

    if (!jobResponse.ok) {
      const errorData = await jobResponse.json();
      throw new Error(errorData.error || "Failed to create conversion job.");
    }

    const { data } = await jobResponse.json();
    const jobId = data.id;

    // Step 2: Upload File
    const uploadTask = data.tasks.find((task: { name: string }) => task.name === "import");
    if (!uploadTask || !uploadTask.result || !uploadTask.result.form) {
      throw new Error("Failed to retrieve upload URL.");
    }

    const uploadUrl = uploadTask.result.form.url;
    const uploadFormData = new FormData();
    Object.entries(uploadTask.result.form.parameters).forEach(([key, value]) => {
      uploadFormData.append(key, value as string);
    });
    uploadFormData.append("file", new Blob([fileBuffer], { type: file.type }), file.name);

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      throw new Error("File upload failed.");
    }

    // Step 3: Wait for Conversion to Complete
    let exportUrl: string | null = null;
    while (!exportUrl) {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const statusResponse = await fetch(`${CLOUDCONVERT_API_URL}/v2/jobs/${jobId}`, {
        headers: { "Authorization": `Bearer ${CLOUDCONVERT_API_KEY}` },
      });

      if (!statusResponse.ok) {
        throw new Error("Failed to get job status.");
      }

      const statusData = await statusResponse.json();
      if (statusData.data.status === "finished") {
        exportUrl = statusData.data.tasks
          .find((task: { name: string }) => task.name === "export")
          ?.result?.files?.[0]?.url || null;
      }
    }

    return NextResponse.json({ downloadUrl: exportUrl });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
