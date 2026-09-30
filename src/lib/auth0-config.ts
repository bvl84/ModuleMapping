/**
 * Auth0 SPA configuration for the Authorization Code Flow (with PKCE) via the
 * `@auth0/auth0-react` SDK.
 *
 * These identifiers (issuer/domain, clientId, organization) are public — they
 * are sent to the browser as part of the /authorize redirect — so it's safe to
 * keep defaults here. Any value can be overridden with a NEXT_PUBLIC_ env var.
 */

/** Strip surrounding/embedded whitespace that can sneak in via env vars. */
function clean(value: string): string {
  return value.replace(/\s+/g, "");
}

/** Shared public config. Env vars override these defaults. */
export const APP_CONFIG = {
  API_URL: clean(process.env.NEXT_PUBLIC_API_URL ?? "https://api.pim.motilidev.com").replace(
    /\/+$/,
    "",
  ),
  AUTH0_DOMAIN: "login.motilidev.com",
  AUTH0_CLIENT_ID: "hDyMndAoNb2bLD1EK1W8OvolBOf644Kg",
  AUTH0_AUDIENCE: "https://api.pim.motilidev.com",
} as const;

const rawIssuer = clean(
  process.env.NEXT_PUBLIC_AUTH0_ISSUER ?? `https://${APP_CONFIG.AUTH0_DOMAIN}`,
);

/** Bare host for the SDK's `domain` prop (no scheme, no trailing slash). */
function toDomain(issuerOrDomain: string): string {
  return clean(issuerOrDomain)
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
}

export const AUTH0_CONFIG = {
  issuer: rawIssuer,
  domain: toDomain(process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? APP_CONFIG.AUTH0_DOMAIN),
  clientId: clean(
    process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? APP_CONFIG.AUTH0_CLIENT_ID,
  ),
  /** Scopes auth to the organization; added to the /authorize redirect. */
  organization: clean(
    process.env.NEXT_PUBLIC_AUTH0_ORGANIZATION ?? "org_8eLgTLpNbWzHM7fF",
  ),
  /**
   * API audience for the PIM workflow service. Auth0 mints a JWT access token
   * for this API, which is forwarded as the Bearer Authorization header.
   * No trailing slash: Auth0 rejected `https://api.pim.motilidev.com/`.
   */
  audience: clean(process.env.NEXT_PUBLIC_AUTH0_AUDIENCE ?? APP_CONFIG.AUTH0_AUDIENCE),
} as const;
