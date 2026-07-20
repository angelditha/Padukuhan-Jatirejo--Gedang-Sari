import { NextResponse } from "next/server";

// In-memory serverless cache with fallback to external cloud storage
let globalCloudStore: any = null;

export async function GET() {
  try {
    if (globalCloudStore) {
      return NextResponse.json({ success: true, data: globalCloudStore });
    }

    // Try fetching from public cloud sync endpoint
    const res = await fetch("https://api.jsonbin.io/v3/b/66928420e41b4d34e4125b29/latest", {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      globalCloudStore = json.record;
      return NextResponse.json({ success: true, data: globalCloudStore });
    }

    return NextResponse.json({ success: false, data: null });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    globalCloudStore = {
      ...body,
      lastUpdated: Date.now(),
    };

    // Push to public cloud bin for global multi-device persistence
    fetch("https://api.jsonbin.io/v3/b/66928420e41b4d34e4125b29", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": "$2a$10$8vFpZJgDq/g/s/2W1d9wJ.7nQ1m8KkR0",
      },
      body: JSON.stringify(globalCloudStore),
    }).catch((e) => console.error("Cloud push background error:", e));

    return NextResponse.json({ success: true, data: globalCloudStore });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
