import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// High-reliability multi-provider cloud database for Padukuhan Jatirejo
const PRIMARY_CLOUD_URL = "https://api.jsonbin.io/v3/b/66928420e41b4d34e4125b29";
const SECONDARY_CLOUD_URL = "https://api.npoint.io/401ae6b4d3e5cf7381b1";

let globalMemoryStore: any = null;

export async function GET() {
  try {
    // 1. Try Primary Cloud Storage
    const res = await fetch(`${PRIMARY_CLOUD_URL}/latest`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.record) {
        globalMemoryStore = json.record;
        return NextResponse.json(
          { success: true, data: globalMemoryStore },
          { headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } }
        );
      }
    }
  } catch (e) {
    console.warn("Primary cloud GET failed:", e);
  }

  try {
    // 2. Try Secondary Cloud Storage
    const res2 = await fetch(SECONDARY_CLOUD_URL, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (res2.ok) {
      const json2 = await res2.json();
      if (json2) {
        globalMemoryStore = json2;
        return NextResponse.json(
          { success: true, data: globalMemoryStore },
          { headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } }
        );
      }
    }
  } catch (e2) {
    console.warn("Secondary cloud GET failed:", e2);
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

    // 1. Save to Primary Cloud Storage
    const primaryPromise = fetch(PRIMARY_CLOUD_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": "$2a$10$8vFpZJgDq/g/s/2W1d9wJ.7nQ1m8KkR0",
      },
      body: JSON.stringify(globalMemoryStore),
    });

    // 2. Save to Secondary Cloud Storage
    const secondaryPromise = fetch(SECONDARY_CLOUD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(globalMemoryStore),
    });

    await Promise.allSettled([primaryPromise, secondaryPromise]);

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
