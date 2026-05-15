import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // La disattiva mentre sviluppiamo per evitare bug di cache
});

const nextConfig: NextConfig = {
  turbopack: {},
};

export default withPWA(nextConfig);