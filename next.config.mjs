import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['data'],
  },
};

const pwaConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

export default pwaConfig(nextConfig);
