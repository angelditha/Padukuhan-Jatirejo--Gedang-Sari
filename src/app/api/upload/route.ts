import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // 1. Prepare Catbox payload
    const catboxFormData = new FormData();
    catboxFormData.append("reqtype", "fileupload");
    catboxFormData.append("fileToUpload", file);

    console.log("Uploading file to Catbox server-to-server...");
    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: catboxFormData,
    });

    if (res.ok) {
      const url = await res.text();
      if (url && url.startsWith("http")) {
        console.log("Catbox upload success URL:", url.trim());
        return NextResponse.json({ success: true, url: url.trim() });
      }
    }

    const errText = await res.text();
    console.error("Catbox upload failed on server:", errText);
    return NextResponse.json({ success: false, error: "Upload failed on server: " + errText }, { status: 500 });
  } catch (err: any) {
    console.error("Upload API route error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
