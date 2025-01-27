import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  compiler:  {
    styledComponents:{
      minify:false,
    },
  },
};
 
export default nextConfig;
