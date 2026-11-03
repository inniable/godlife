/** @type {import('next').NextConfig} */
const isExport = process.env.NEXT_EXPORT === 'true';

const nextConfig = {
  reactStrictMode: true,
  output: isExport ? 'export' : 'standalone',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
