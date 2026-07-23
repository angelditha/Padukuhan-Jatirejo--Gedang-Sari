import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // 1. Prepare ImgBB payload
    const imgbbFormData = new FormData();
    imgbbFormData.append("image", file);

    console.log("Uploading file to ImgBB server-to-server...");
    const res = await fetch("https://api.imgbb.com/1/upload?key=9c5f4b301988898144b679469e35ff93", {
      method: "POST",
      body: imgbbFormData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.data?.url) {
        return NextResponse.json({ success: true, url: data.data.url });
      }
    }

    const errText = await res.text();
    console.error("ImgBB upload failed on server:", errText);
    return NextResponse.json({ success: false, error: "Upload failed on server" }, { status: 500 });
  } catch (err: any) {
    console.error("Upload API route error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
