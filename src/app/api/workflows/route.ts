import { NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/auth0-config";

/**
 * Server-side proxy for the PIM workflow-service listing endpoint.
 *
 * Fetching from the browser directly would expose the access token and is
 * subject to CORS. This route fetches upstream, strips the heavy nested
 * `workflow`/`theming` blobs, and returns a lightweight summary list for the
 * Workflows landing page.
 */

export const dynamic = "force-dynamic";

const UPSTREAM_URL = `${APP_CONFIG.API_URL}/workflow-service/workflows/companies/all`;

export type WorkflowSummary = {
  id: number;
  guid: string;
  companyId: string;
  companyName: string;
  workflowType: string;
  businessChannelKey: string;
  title: string;
  version: string | null;
  createdAt: string | null;
  createdBy: string | null;
  updatedAt: string | null;
};

function asString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function toSummary(raw: unknown): WorkflowSummary | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const id = typeof item.id === "number" ? item.id : Number(item.id);
  const guid = asString(item.guid);
  if (!guid || Number.isNaN(id)) return null;

  const workflow = item.workflow as Record<string, unknown> | undefined;
  const innerWorkflow = workflow?.workflow as Record<string, unknown> | undefined;
  const title = asString(innerWorkflow?.title) ?? asString(item.companyName) ?? guid;

  return {
    id,
    guid,
    companyId: asString(item.companyId) ?? "",
    companyName: asString(item.companyName) ?? "",
    workflowType: asString(item.workflowType) ?? "",
    businessChannelKey: asString(item.businessChannelKey) ?? "",
    title,
    version: asString(item.version),
    createdAt: asString(item.createdAt),
    // Upstream doesn't currently expose an author; map defensively so this
    // lights up automatically if a createdBy/author field is added later.
    createdBy:
      asString(item.createdBy) ??
      asString(item.createdByUser) ??
      asString(item.author) ??
      asString(item.updatedBy) ??
      null,
    updatedAt: asString(item.updatedAt),
  };
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }
    const res = await fetch(UPSTREAM_URL, {
      headers: {
        Accept: "application/json",
        Authorization: authHeader,
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
    const workflows = list
      .map(toSummary)
      .filter((w): w is WorkflowSummary => w !== null);

    return NextResponse.json({ workflows });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch workflows" },
      { status: 502 },
    );
  }
}
