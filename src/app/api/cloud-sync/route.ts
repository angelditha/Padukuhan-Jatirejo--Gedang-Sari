import { NextResponse } from "next/server";

// Global cache for serverless invocation
let globalCloudStore: any = null;

export async function GET() {
  try {
    // Always fetch latest state from Cloud DB to avoid stale reads
    const res = await fetch(
      "https://api.jsonbin.io/v3/b/66928420e41b4d34e4125b29/latest",
      {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (res.ok) {
      const json = await res.json();
      globalCloudStore = json.record;
      return NextResponse.json(
        { success: true, data: globalCloudStore },
        { headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } }
      );
    }

    if (globalCloudStore) {
      return NextResponse.json({ success: true, data: globalCloudStore });
    }

    return NextResponse.json({ success: false, data: null });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    globalCloudStore = {
      ...body,
      lastUpdated: Date.now(),
    };

    // MUST AWAIT Cloud DB PUT so Vercel Serverless Function doesn't terminate early
    const res = await fetch("https://api.jsonbin.io/v3/b/66928420e41b4d34e4125b29", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": "$2a$10$8vFpZJgDq/g/s/2W1d9wJ.7nQ1m8KkR0",
      },
      body: JSON.stringify(globalCloudStore),
    });

    if (res.ok) {
      const json = await res.json();
      globalCloudStore = json.record;
    }

    return NextResponse.json(
      { success: true, data: globalCloudStore },
      { headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
