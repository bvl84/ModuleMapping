"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Rendered on `/` when Auth0 redirects back with ?code&state. The Auth0Provider
 * (root layout) exchanges the code for tokens; once a session exists we route to
 * /workflows. This does the redirect itself (rather than relying only on the
 * provider's onRedirectCallback) and surfaces any error instead of hanging.
 */
export function AuthCallback() {
  const { isLoading, isAuthenticated, error, loginWithRedirect } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/workflows");
    }
  }, [isLoading, isAuthenticated, router]);

  if (error) {
    return (
      <div className="holo-bg flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm font-semibold text-red-300">Sign-in failed</p>
        <p className="max-w-md break-words text-xs text-slate-400">{error.message}</p>
        <button
          type="button"
          onClick={() => loginWithRedirect()}
          className="rounded-full border border-cyan-400/60 bg-cyan-400/90 px-4 py-1.5 text-xs font-semibold text-[#04121a] hover:bg-cyan-300"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="holo-bg flex min-h-screen items-center justify-center">
      <p className="text-sm text-slate-400">Signing you in…</p>
    </div>
  );
}
