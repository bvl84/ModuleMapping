/**
 * Auth0 SPA configuration for the Authorization Code Flow (with PKCE) via the
 * `@auth0/auth0-react` SDK.
 *
 * These identifiers (issuer/domain, clientId, organization) are public — they
 * are sent to the browser as part of the /authorize redirect — so it's safe to
 * keep defaults here. Any value can be overridden with a NEXT_PUBLIC_ env var.
 */

const rawIssuer =
  process.env.NEXT_PUBLIC_AUTH0_ISSUER ?? "https://login.motilidev.com";

/** Bare host for the SDK's `domain` prop (no scheme, no trailing slash). */
function toDomain(issuerOrDomain: string): string {
  return issuerOrDomain.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

export const AUTH0_CONFIG = {
  issuer: rawIssuer,
  domain: toDomain(process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? rawIssuer),
  clientId:
    process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? "hDyMndAoNb2bLD1EK1W8OvolBOf644Kg",
  /** Scopes auth to the organization; added to the /authorize redirect. */
  organization:
    process.env.NEXT_PUBLIC_AUTH0_ORGANIZATION ?? "org_8eLgTLpNbWzHM7fF",
  /**
   * API audience for the PIM workflow service. When set, Auth0 mints a JWT
   * access token for this API (instead of an opaque token), which is what we
   * forward as the Bearer Authorization header on API calls. Leave unset to use
   * the tenant's Default Audience.
   */
  audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || undefined,
} as const;
