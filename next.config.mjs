import { env } from "process";

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DIRECT_URL: process.env.DIRECT_URL,
  },
};

export default nextConfig;
