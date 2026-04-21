import { auth } from "@/auth";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL!;

/**
 * All client-side API calls hit /api/proxy/...
 * This route injects the backend token from the server-side session so it
 * is never exposed to the browser.
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, await params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, await params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, await params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, await params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, await params);
}

async function proxyRequest(
  request: NextRequest,
  { path }: { path: string[] },
): Promise<NextResponse> {
  // ---- Inject backend token from server-side session ----
  const session = await auth();
  if (!session?.backendToken) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const pathSegment = path.length ? path.join("/") : "";
  const pathWithSlash = pathSegment.endsWith("/") ? pathSegment : `${pathSegment}/`;
  const query = new URL(request.url).searchParams.toString();
  const targetUrl = `${backendBase}/${pathWithSlash}${query ? `?${query}` : ""}`;

  // ---- Build headers: strip hop-by-hop, inject auth ----
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (
      lower === "host" ||
      lower === "connection" ||
      lower === "authorization" || // replaced below
      lower.startsWith("next-")
    ) return;
    headers[key] = value;
  });
  headers["Authorization"] = `Token ${session.backendToken}`;

  // ---- Forward request body ----
  let data: string | ArrayBuffer | undefined;
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    const contentType = request.headers.get("content-type") ?? "";
    data = contentType.includes("multipart/form-data")
      ? await request.arrayBuffer()
      : await request.text();
  }

  try {
    const res = await axios.request({
      method: request.method as "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
      url: targetUrl,
      headers,
      data,
      validateStatus: () => true,
    });

    // ---- Forward response headers (strip hop-by-hop) ----
    const resHeaders = new Headers();
    Object.entries(res.headers ?? {}).forEach(([key, value]) => {
      const lower = key.toLowerCase();
      if (
        lower === "connection" ||
        lower === "transfer-encoding" ||
        lower === "content-length" ||
        lower === "content-encoding"
      ) return;
      if (value == null) return;
      if (Array.isArray(value)) {
        value.forEach((v) => resHeaders.append(key, String(v)));
      } else {
        resHeaders.set(key, String(value));
      }
    });

    return new NextResponse(
      typeof res.data === "string" ? res.data : JSON.stringify(res.data),
      { status: res.status, statusText: res.statusText, headers: resHeaders },
    );
  } catch (err) {
    console.error("[proxy] axios error:", err);
    return NextResponse.json({ error: "Proxy request failed" }, { status: 502 });
  }
}
