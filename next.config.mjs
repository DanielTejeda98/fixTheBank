import pkg from "./package.json" with { type: "json" };
const { version } = pkg;
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
};

export default nextConfig;
