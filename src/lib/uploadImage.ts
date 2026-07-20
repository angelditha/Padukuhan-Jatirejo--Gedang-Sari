// Cloud Image Upload Handler for Padukuhan Jatirejo
// Converts uploaded local images/videos into fast Cloud URLs so multi-device sync is instant and 100% reliable.

export async function uploadToCloudHost(file: File): Promise<string | null> {
  try {
    // 1. Try ImgBB Free Public Upload API
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
    console.warn("ImgBB primary upload error, trying secondary fallback:", e);
  }

  try {
    // 2. Secondary Fallback: Free Cloudinary Public Endpoint
    const formData2 = new FormData();
    formData2.append("file", file);
    formData2.append("upload_preset", "preset_jatirejo");

    const res2 = await fetch("https://api.cloudinary.com/v1_1/dithajatirejo/image/upload", {
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
    console.warn("Cloudinary secondary fallback error:", e2);
  }

  return null;
}
