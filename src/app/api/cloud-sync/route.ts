import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// High-reliability JSONBlob database for Padukuhan Jatirejo
const CLOUD_BLOB_URL = "https://jsonblob.com/api/jsonBlob/019f8e68-cf96-7795-8b11-ae3c4b2100e8";

let globalMemoryStore: any = null;

export async function GET() {
  try {
    const res = await fetch(CLOUD_BLOB_URL, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json) {
        globalMemoryStore = json;
        return NextResponse.json(
          { success: true, data: globalMemoryStore },
          { headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } }
        );
      }
    }
  } catch (e) {
    console.warn("Cloud GET failed:", e);
  }

  if (globalMemoryStore) {
    return NextResponse.json({ success: true, data: globalMemoryStore });
  }

  return NextResponse.json({ success: false, data: null });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    globalMemoryStore = {
      ...body,
      lastUpdated: Date.now(),
    };

    const res = await fetch(CLOUD_BLOB_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(globalMemoryStore),
    });

    if (res.ok) {
      const json = await res.json();
      if (json) {
        globalMemoryStore = json;
      }
    }

    return NextResponse.json(
      { success: true, data: globalMemoryStore },
      { headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
