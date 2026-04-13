import type { NextConfig } from "next";

/**
 * Явный корень для Turbopack при двух lockfile (корень репо + bilimbridge).
 * Используем process.cwd() вместо import.meta.url — так надёжнее в CI/GitHub checks.
 * На Vercel с Root Directory = bilimbridge cwd при сборке = папка приложения.
 */
const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
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
