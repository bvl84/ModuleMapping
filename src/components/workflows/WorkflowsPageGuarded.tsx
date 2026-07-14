"use client";

import { withAuthenticationRequired } from "@auth0/auth0-react";
import { MapperAppShell } from "@/components/layout/MapperAppShell";
import { WorkflowsPageClient } from "./WorkflowsPageClient";

/**
 * Workflows is the only gated route. `withAuthenticationRequired` redirects
 * unauthenticated visitors to the Auth0 login (Authorization Code Flow, scoped
 * to the organization via the provider's authorizationParams) and renders the
 * page only once a session exists.
 */
export const WorkflowsPageGuarded = withAuthenticationRequired(WorkflowsPageClient, {
  onRedirecting: () => (
    <MapperAppShell holo>
      <div className="mx-auto w-full max-w-[min(100%,1400px)] px-5 py-16 text-center sm:px-8 lg:px-12">
        <p className="text-sm text-slate-400">Redirecting to sign in…</p>
      </div>
    </MapperAppShell>
  ),
});
