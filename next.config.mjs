/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // node-ical uses dynamic requires (moment-timezone, rrule) that break when
  // webpack bundles them — keep it external and required at runtime
  serverExternalPackages: ['node-ical'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig