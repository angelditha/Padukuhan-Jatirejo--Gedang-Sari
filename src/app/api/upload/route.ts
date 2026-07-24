import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name || "upload.png";

    console.log(`Uploading file (${filename}) to Pixeldrain server-to-server...`);
    const res = await fetch(`https://pixeldrain.com/api/file/${encodeURIComponent(filename)}`, {
      method: "PUT",
      body: buffer,
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.id) {
        const directUrl = `https://pixeldrain.com/api/file/${data.id}`;
        console.log("Pixeldrain upload success URL:", directUrl);
        return NextResponse.json({ success: true, url: directUrl });
      }
    }

    const errText = await res.text();
    console.error("Pixeldrain upload failed on server:", errText);
    return NextResponse.json({ success: false, error: "Upload failed on server: " + errText }, { status: 500 });
  } catch (err: any) {
    console.error("Upload API route error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
