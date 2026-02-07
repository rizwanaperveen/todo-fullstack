/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable, so no need for experimental flag
  images: {
    domains: ['localhost'], // Add any image domains you'll use
  },
};

module.exports = nextConfig;