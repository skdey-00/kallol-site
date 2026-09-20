/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      { source: '/amavasya-puja-2025', destination: '/amavasya-puja-2026', permanent: true },
      { source: '/durga-puja-2025', destination: '/durga-puja-2026', permanent: true },
      { source: '/kali-puja-2025', destination: '/kali-puja-2026', permanent: true },
      { source: '/lakshmi-puja-2025', destination: '/lakshmi-puja-2026', permanent: true },
      { source: '/saraswati-puja-2025', destination: '/saraswati-puja-2026', permanent: true },
    ]
  },
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