import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Convert the uploaded file to a base64 string on the server side
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    console.log(`Uploading file (${file.name}) to Imgur proxy server-to-server...`);
    const body = new URLSearchParams();
    body.append("image", base64);
    body.append("type", "base64");

    const res = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        "Authorization": "Client-ID 546c25a59c58ad7",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.data?.link) {
        console.log("Imgur upload success URL:", data.data.link);
        return NextResponse.json({ success: true, url: data.data.link });
      }
    }

    const errText = await res.text();
    console.error("Imgur upload failed on server:", errText);
    return NextResponse.json({ success: false, error: "Upload failed on server: " + errText }, { status: 500 });
  } catch (err: any) {
    console.error("Upload API route error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
