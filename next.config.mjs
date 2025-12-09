/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  
  basePath: process.env.NODE_ENV === 'production' ? '/edu-survival-kit' : '',
  
  trailingSlash: true,
}

export default nextConfig
