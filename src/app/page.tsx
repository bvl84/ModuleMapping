import { redirect } from "next/navigation";
import { AuthCallback } from "@/components/auth/AuthCallback";

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

  // Auth0 callback: the client gate lets the Auth0Provider (root layout) process
  // ?code&state, then routes to /workflows (and shows an error if it fails).
  return <AuthCallback />;
}
