import { NextRequest, NextResponse } from "next/server";

type ValidOperations =
  | "import/url"
  | "import/upload"
  | "import/base64"
  | "import/raw"
  | "import/s3"
  | "import/azure/blob"
  | "import/google-cloud-storage"
  | "import/openstack"
  | "import/sftp"
  | "export/sftp";

interface ConversionRequest {
  operation: ValidOperations;
  input: string;
  output_format: string;
  engine: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    if (
      !body.operation ||
      !body.input ||
      !body.output_format ||
      !body.engine
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure operation is a valid type
    if (!isValidOperation(body.operation)) {
      return NextResponse.json(
        { error: "Invalid operation type" },
        { status: 400 }
      );
    }

    const conversionRequest: ConversionRequest = {
      operation: body.operation,
      input: body.input,
      output_format: body.output_format,
      engine: body.engine,
    };

    // Process conversion (Dummy Response)
    return NextResponse.json(
      {
        message: "File conversion started",
        data: conversionRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// Helper function to validate operation type
function isValidOperation(op: string): op is ValidOperations {
  return [
    "import/url",
    "import/upload",
    "import/base64",
    "import/raw",
    "import/s3",
    "import/azure/blob",
    "import/google-cloud-storage",
    "import/openstack",
    "import/sftp",
    "export/sftp",
  ].includes(op);
}
