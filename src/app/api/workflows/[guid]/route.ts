import { NextResponse } from "next/server";

/**
 * Server-side proxy that returns the FULL workflow record for a single guid.
 *
 * The listing route (`/api/workflows`) strips the heavy nested `workflow`/
 * `theming` blobs for a lightweight card list. The Update flow needs the whole
 * record so the Schema Configurator can hydrate the form and save it back with
 * the original id/guid/theming intact. The upstream listing endpoint returns
 * full records, so we fetch it and pick the matching guid.
 */

export const dynamic = "force-dynamic";

const UPSTREAM_URL =
  "https://api.pim.motilidev.com/workflow-service/workflows/companies/all?noAuthVar=MotiliWorkflow98528";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ guid: string }> },
) {
  const { guid } = await params;
  try {
    // Forward the caller's Auth0 Bearer token (if present) to the upstream API.
    const authHeader = req.headers.get("authorization");
    const res = await fetch(UPSTREAM_URL, {
      headers: {
        Accept: "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream responded with ${res.status}` },
        { status: 502 },
      );
    }

    const data = (await res.json()) as unknown;
    const list = Array.isArray(data) ? data : [];
    const record = list.find(
      (item): item is Record<string, unknown> =>
        !!item &&
        typeof item === "object" &&
        (item as Record<string, unknown>).guid === guid,
    );

    if (!record) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    return NextResponse.json({ record });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch workflow" },
      { status: 502 },
    );
  }
}
