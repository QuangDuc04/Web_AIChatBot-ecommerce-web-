import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

const nextConfig: NextConfig = {
  output: "standalone",
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  reactStrictMode: false,
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "banhanggiasi.com.vn",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
