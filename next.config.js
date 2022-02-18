/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.discordapp.com', 'avatars.githubusercontent.com']
  }
};

module.exports = nextConfig;
