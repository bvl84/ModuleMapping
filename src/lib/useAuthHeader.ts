"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

/**
 * Returns an async function that produces the Authorization header carrying the
 * Auth0 access token (the JWT from the /oauth/token exchange, retrieved via
 * getAccessTokenSilently).
 *
 * Returns an empty object when there is no session/token so callers can still
 * fall back to the existing noAuthVar bypass without throwing.
 */
export function useAuthHeader(): () => Promise<Record<string, string>> {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  return useCallback(async () => {
    if (!isAuthenticated) return {};
    try {
      const token = await getAccessTokenSilently();
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
      return {};
    }
  }, [getAccessTokenSilently, isAuthenticated]);
}
