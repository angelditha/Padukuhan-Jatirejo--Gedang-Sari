// Cloud Sync Utility for Padukuhan Jatirejo Website
// Enables instant real-time synchronization of Galeri, Potensi, Budaya, and Berita across all devices (Mobile & Laptop)

const CLOUD_STORAGE_KEY = "jatirejo_cloud_v1";
// Public high-reliability cloud database endpoint for real-time multi-device sync
const CLOUD_API_URL = "https://jsonblob.com/api/jsonBlob/019f8e84-5e6d-7b87-9285-37b83c6d9751";

export interface CloudDataPayload {
  galeri?: any[];
  potensi?: any[];
  budaya?: any[];
  berita?: any[];
  lastUpdated?: number;
}

// Fetch dynamic content from Cloud API directly from the client browser
export async function fetchCloudData(): Promise<CloudDataPayload | null> {
  try {
    const res = await fetch(`${CLOUD_API_URL}?t=${Date.now()}`, {
      method: "GET",
      cache: "no-store"
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data || null;
  } catch (err) {
    console.warn("Cloud sync fetch fallback to local storage:", err);
    return null;
  }
}

// Push updated dynamic content directly from client browser, merging table atomic-style
export async function saveCloudData(sectionKey: keyof CloudDataPayload, sectionData: any[]): Promise<boolean> {
  try {
    // 1. Fetch current DB state directly from browser
    const resGet = await fetch(`${CLOUD_API_URL}?t=${Date.now()}`, { cache: "no-store" });
    let currentDB: CloudDataPayload = {};
    if (resGet.ok) {
      const json = await resGet.json();
      if (json) currentDB = json;
    }

    // 2. Merge updated section
    const fullPayload = {
      ...currentDB,
      [sectionKey]: sectionData,
      lastUpdated: Date.now(),
    };

    // 3. PUT back directly from browser
    const res = await fetch(CLOUD_API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fullPayload),
    });

    return res.ok;
  } catch (err) {
    console.error("Cloud sync save error:", err);
    return false;
  }
}
