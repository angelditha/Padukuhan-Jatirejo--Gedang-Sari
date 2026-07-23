// Cloud Storage Handler for Padukuhan Jatirejo
// Proxies photo and video uploads through our local serverless API route to prevent CORS issues.

export async function uploadToCloudHost(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    console.log("Uploading via local API proxy...");
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.url) {
        return data.url;
      }
    } else {
      console.warn("Local upload API returned status:", res.status);
    }
  } catch (e) {
    console.error("Local upload proxy error:", e);
  }

  return null;
}
