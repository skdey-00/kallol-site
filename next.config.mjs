/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type errors now fail the build again — this was previously disabled,
    // which let real bugs ship (e.g. PageSizes.A4_LANDSCAPE crash).
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    // Old year-specific puja URLs (2025) were renamed to evergreen routes.
    // Legacy kallolmumbai.com (WordPress) route equivalents, mapped to the
    // rebuilt evergreen routes so old inbound links and search results resolve.
    return [
      { source: '/amavasya-puja-2025', destination: '/amavasya-puja', permanent: true },
      { source: '/durga-puja-2025', destination: '/durga-puja', permanent: true },
      { source: '/kali-puja-2025', destination: '/kali-puja', permanent: true },
      { source: '/lakshmi-puja-2025', destination: '/lakshmi-puja', permanent: true },
      { source: '/saraswati-puja-2025', destination: '/saraswati-puja', permanent: true },
      // Legacy WordPress paths (see site-data/pages.json crawl)
      { source: '/about-kallol', destination: '/about', permanent: true },
      { source: '/donation', destination: '/donate', permanent: true },
      { source: '/other-donation', destination: '/donate', permanent: true },
      { source: '/puja/amabasya-puja', destination: '/amavasya-puja', permanent: true },
      { source: '/puja/durga-puja', destination: '/durga-puja', permanent: true },
      { source: '/puja/kali-puja', destination: '/kali-puja', permanent: true },
      { source: '/puja/laxmi-puja', destination: '/lakshmi-puja', permanent: true },
      { source: '/puja/saraswati-puja', destination: '/saraswati-puja', permanent: true },
      { source: '/puja/special-puja', destination: '/special-puja', permanent: true },
      { source: '/special-puja-services', destination: '/special-puja', permanent: true },
      { source: '/narayan-puja', destination: '/special-puja', permanent: true },
      { source: '/facility-for-events', destination: '/facilities-services', permanent: true },
      { source: '/medical-library-facility', destination: '/medical-services', permanent: true },
      { source: '/2025-puja-calendar', destination: '/calendar', permanent: true },
      { source: '/privacy-policy-2', destination: '/privacy-policy', permanent: true },
      { source: '/events', destination: '/upcoming-events', permanent: true },
      { source: '/events-2', destination: '/upcoming-events', permanent: true },
      { source: '/other-events', destination: '/upcoming-events', permanent: true },
      { source: '/other-festivals', destination: '/upcoming-events', permanent: true },
    ]
  },
}

export default nextConfig