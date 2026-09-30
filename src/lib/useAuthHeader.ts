"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

/**
 * Returns an async function that produces the Authorization header carrying the
 * Auth0 access token (the JWT from the /oauth/token exchange, retrieved via
 * getAccessTokenSilently).
 *
 * Throws when there is no session or token so callers never send an
 * unauthenticated PIM request.
 */
export function useAuthHeader(): () => Promise<Record<string, string>> {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  return useCallback(async (): Promise<Record<string, string>> => {
    if (!isAuthenticated) {
      throw new Error("Not signed in");
    }
    const token = await getAccessTokenSilently();
    if (!token) {
      throw new Error("Not signed in");
    }
    return { Authorization: `Bearer ${token}` };
  }, [getAccessTokenSilently, isAuthenticated]);
}
