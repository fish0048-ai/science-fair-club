import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/": ["./content/**/*", "./國中科展社團課程/**/*"],
    "/api/chat": ["./content/**/*", "./國中科展社團課程/**/*"],
    "/docs/[...slug]": ["./content/**/*", "./國中科展社團課程/**/*"],
  },
};

export default nextConfig;
