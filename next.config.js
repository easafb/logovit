/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ❗ Prod build sırasında ESLint hatalarını bloklama
    ignoreDuringBuilds: true,
  },
  // (isteğe bağlı) TypeScript hatalarını da bloklama:
  // typescript: { ignoreBuildErrors: true }
};

module.exports = nextConfig;
