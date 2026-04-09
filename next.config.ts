import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Stable project root even if `npm run dev` is started from another cwd */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  /** Friendly aliases (spaces / casing) → canonical slugs */
  async redirects() {
    return [
      { source: "/Cinch", destination: "/cinch", permanent: false },
      { source: "/GreenTech", destination: "/greentech", permanent: false },
      { source: "/Solutions Builder", destination: "/solutions-builder", permanent: false },
      { source: "/Solutions%20Builder", destination: "/solutions-builder", permanent: false },
      { source: "/Comparison", destination: "/comparison", permanent: false },
      { source: "/Future State", destination: "/future-state", permanent: false },
      { source: "/Future%20State", destination: "/future-state", permanent: false },
      { source: "/Future State Visual", destination: "/future-state-visual", permanent: false },
      { source: "/Future%20State%20Visual", destination: "/future-state-visual", permanent: false },
    ];
  },
};

export default nextConfig;
