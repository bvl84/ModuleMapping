import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Stable project root even if `npm run dev` is started from another cwd */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  /**
   * Friendly aliases for paths with spaces (encoded or not).
   * Do not add /Cinch → /cinch style rules: Next can match sources case-insensitively,
   * so /cinch would 307 to itself and browsers report ERR_TOO_MANY_REDIRECTS.
   */
  async redirects() {
    return [
      { source: "/Solutions Builder", destination: "/solutions-builder", permanent: false },
      { source: "/Solutions%20Builder", destination: "/solutions-builder", permanent: false },
      { source: "/Future State", destination: "/future-state", permanent: false },
      { source: "/Future%20State", destination: "/future-state", permanent: false },
      { source: "/Future State Visual", destination: "/future-state-visual", permanent: false },
      { source: "/Future%20State%20Visual", destination: "/future-state-visual", permanent: false },
    ];
  },
};

export default nextConfig;
