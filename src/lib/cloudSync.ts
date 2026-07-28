// Cloud Sync Utility for Padukuhan Jatirejo Website
// Enables instant real-time synchronization of Galeri, Potensi, Budaya, and Berita across all devices (Mobile & Laptop)

export interface CloudDataPayload {
  galeri?: any[];
  potensi?: any[];
  budaya?: any[];
  berita?: any[];
  lastUpdated?: number;
}

// Fetch dynamic content from local API proxy (same-origin, no CORS blocks)
export async function fetchCloudData(): Promise<CloudDataPayload | null> {
  try {
    const res = await fetch(`/api/cloud-sync?t=${Date.now()}`, {
      method: "GET",
      cache: "no-store"
    });

    if (!res.ok) return null;
    const json = await res.json();
    if (json && json.success && json.data) {
      return json.data;
    }
    return null;
  } catch (err) {
    console.warn("Cloud sync fetch fallback to local storage:", err);
    return null;
  }
}

// Push updated dynamic content directly to local API proxy (same-origin, no CORS blocks)
export async function saveCloudData(sectionKey: keyof CloudDataPayload, sectionData: any[]): Promise<boolean> {
  try {
    const res = await fetch("/api/cloud-sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [sectionKey]: sectionData
      }),
    });

    if (!res.ok) return false;
    const json = await res.json();
    return !!json?.success;
  } catch (err) {
    console.error("Cloud sync save error:", err);
    return false;
  }
}
