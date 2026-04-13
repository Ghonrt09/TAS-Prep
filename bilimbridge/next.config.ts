import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

/** Явный корень для Turbopack: иначе при двух lockfile (корень репо + bilimbridge) Next выбирает родителя и сборка на Vercel падает. */
const turbopackRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: turbopackRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
