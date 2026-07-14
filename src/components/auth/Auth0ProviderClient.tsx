"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { AUTH0_CONFIG } from "@/lib/auth0-config";

/**
 * Wraps the app in the Auth0 SPA provider, enabling the Authorization Code Flow
 * with PKCE. The `organization` authorization parameter is passed through so the
 * /authorize redirect is scoped to the organization.
 */
export function Auth0ProviderClient({ children }: { children: ReactNode }) {
  const router = useRouter();

  // After the Auth0 login callback, always land on the Workflows page (and strip
  // the ?code=&state= query params from the URL).
  const onRedirectCallback = () => {
    router.replace("/workflows");
  };

  return (
    <Auth0Provider
      domain={AUTH0_CONFIG.domain}
      clientId={AUTH0_CONFIG.clientId}
      onRedirectCallback={onRedirectCallback}
      authorizationParams={{
        redirect_uri:
          typeof window !== "undefined" ? window.location.origin : undefined,
        // Scope authentication to the organization on the /authorize redirect.
        organization: AUTH0_CONFIG.organization,
        // Request a JWT access token for the PIM API (when an audience is set).
        audience: AUTH0_CONFIG.audience,
      }}
      // Persist the session across full page reloads (dev-friendly; localhost
      // often can't complete silent iframe auth due to third-party cookies).
      cacheLocation="localstorage"
      useRefreshTokens
    >
      {children}
    </Auth0Provider>
  );
}
