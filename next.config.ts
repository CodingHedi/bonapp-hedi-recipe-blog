import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  images: {
    unoptimized: true,
  },
  compiler: {
    styledComponents: {
      minify: false,
    },
  },
};

export default nextConfig;