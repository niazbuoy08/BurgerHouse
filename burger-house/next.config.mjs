/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  images: {
    domains: ['ribsandburgers.com', 'cdn-icons-png.flaticon.com'],
  },
};

export default config;
