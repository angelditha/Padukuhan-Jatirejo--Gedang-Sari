// Cloud Storage Handler for Padukuhan Jatirejo
// Uploads photos and videos to Cloud Storage (Cloudinary & ImgBB) to generate lightweight URLs for 100% instant cross-device sync.

export async function uploadToCloudHost(file: File): Promise<string | null> {
  const isVideo = file.type.startsWith("video/");

  // 1. For Video Files: Upload to Cloudinary Auto/Video Endpoint
  if (isVideo) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default"); // Standard public preset

      const res = await fetch("https://api.cloudinary.com/v1_1/demo/auto/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.secure_url) {
          return data.secure_url;
        }
      }
    } catch (e) {
      console.warn("Cloudinary video upload error:", e);
    }

    try {
      // Fallback Video Upload Host (Catbox)
      const formData2 = new FormData();
      formData2.append("reqtype", "fileupload");
      formData2.append("fileToUpload", file);

      const res2 = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: formData2,
      });

      if (res2.ok) {
        const url = await res2.text();
        if (url && url.startsWith("http")) {
          return url.trim();
        }
      }
    } catch (e2) {
      console.warn("Catbox video fallback error:", e2);
    }
  }

  // 2. For Image Files: Upload to ImgBB / Cloudinary Image Endpoint
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("https://api.imgbb.com/1/upload?key=9c5f4b301988898144b679469e35ff93", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.data?.url) {
        return data.data.url;
      }
    }
  } catch (e) {
    console.warn("ImgBB image upload error:", e);
  }

  try {
    const formData2 = new FormData();
    formData2.append("file", file);
    formData2.append("upload_preset", "ml_default");

    const res2 = await fetch("https://api.cloudinary.com/v1_1/demo/image/upload", {
      method: "POST",
      body: formData2,
    });

    if (res2.ok) {
      const data2 = await res2.json();
      if (data2?.secure_url) {
        return data2.secure_url;
      }
    }
  } catch (e2) {
    console.warn("Cloudinary image upload error:", e2);
  }

  return null;
}
