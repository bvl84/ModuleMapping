"use client";

import { useAuth0 } from "@auth0/auth0-react";

/**
 * Header auth widget: triggers the Authorization Code Flow login redirect,
 * shows the signed-in user, and handles logout.
 */
export function AuthControls() {
  const { isLoading, isAuthenticated, user, error, loginWithRedirect, logout } =
    useAuth0();

  if (isLoading) {
    return <span className="text-xs text-slate-400">Checking session…</span>;
  }

  if (error) {
    return (
      <div className="flex items-center gap-2">
        <span className="max-w-[16rem] truncate text-xs text-red-300" title={error.message}>
          Auth error: {error.message}
        </span>
        <button
          type="button"
          onClick={() => loginWithRedirect()}
          className="rounded-full border border-cyan-400/30 bg-white/5 px-4 py-1.5 text-xs font-semibold text-slate-200 hover:bg-cyan-400/10"
        >
          Retry sign in
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => loginWithRedirect()}
        className="rounded-full border border-cyan-400/60 bg-cyan-400/90 px-4 py-1.5 text-xs font-semibold text-[#04121a] shadow-[0_0_18px_-4px_rgba(103,232,249,0.6)] hover:bg-cyan-300"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="max-w-[16rem] truncate text-sm text-slate-300" title={user?.email ?? user?.name}>
        {user?.email ?? user?.name}
      </span>
      <button
        type="button"
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
        className="rounded-full border border-cyan-400/30 bg-white/5 px-4 py-1.5 text-sm font-semibold text-slate-200 hover:bg-cyan-400/10"
      >
        Sign out
      </button>
    </div>
  );
}
