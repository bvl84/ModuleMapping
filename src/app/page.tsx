import { redirect } from "next/navigation";

export default async function RootPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  // An Auth0 callback lands on `/` (redirect_uri = origin) carrying ?code&state
  // (or ?error). Server-redirecting would strip those before the SPA SDK can
  // process them, so only redirect for normal visits.
  const isAuthCallback = sp.code !== undefined || sp.error !== undefined;
  if (!isAuthCallback) {
    redirect("/workflows");
  }

  // Auth0 callback: render a placeholder so the Auth0Provider (root layout) can
  // process ?code&state; its onRedirectCallback then routes to /workflows.
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1e1e1e]">
      <p className="text-sm text-gray-400">Signing you in…</p>
    </div>
  );
}
