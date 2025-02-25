import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TubeXtract",
  description: "Toolkit for extracting",
  openGraph: {
    title: "TubeXtract",
    description: "Toolkit for extracting",
    url:"",
    images: [
      {
        url: "@/public/banner.png",
        width: 1200,
        height: 630,
        alt: "TubeXtract",
      },
    ],
    type: "website",
  },
  icons: {
    icon: { url: "/package-2.ico", type: "image/svg-xml" },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
