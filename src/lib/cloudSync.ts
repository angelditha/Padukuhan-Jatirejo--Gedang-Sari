// Cloud Sync Utility for Padukuhan Jatirejo Website
// Enables instant real-time synchronization of Galeri, Potensi, Budaya, and Berita across all devices (Mobile & Laptop)

const CLOUD_STORAGE_KEY = "jatirejo_cloud_v1";
// Public high-reliability cloud database endpoint for real-time multi-device sync
const CLOUD_API_URL = "https://api.jsonbin.io/v3/b/66928420e41b4d34e4125b29";
const CLOUD_READONLY_URL = "https://api.jsonbin.io/v3/b/66928420e41b4d34e4125b29/latest";

export interface CloudDataPayload {
  galeri?: any[];
  potensi?: any[];
  budaya?: any[];
  berita?: any[];
  lastUpdated?: number;
}

// Fetch dynamic content from Cloud API
export async function fetchCloudData(): Promise<CloudDataPayload | null> {
  try {
    const res = await fetch(CLOUD_READONLY_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 10 }, // Revalidate every 10 seconds on Vercel
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.record || null;
  } catch (err) {
    console.warn("Cloud sync fetch fallback to local storage:", err);
    return null;
  }
}

// Push updated dynamic content to Cloud API
export async function saveCloudData(payload: CloudDataPayload): Promise<boolean> {
  try {
    const fullPayload = {
      ...payload,
      lastUpdated: Date.now(),
    };

    const res = await fetch(CLOUD_API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": "$2a$10$8vFpZJgDq/g/s/2W1d9wJ.7nQ1m8KkR0", // Key for public padukuhan sync
      },
      body: JSON.stringify(fullPayload),
    });

    return res.ok;
  } catch (err) {
    console.error("Cloud sync save error:", err);
    return false;
  }
}
