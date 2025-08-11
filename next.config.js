/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true
  // Для пользовательского сайта (custom domain dotkit.me) basePath/assetPrefix НЕ нужны.
  // Если бы это был project pages (user.github.io/repo), тогда:
  // basePath: "/<repo-name>",
  // assetPrefix: "/<repo-name>/"
};
module.exports = nextConfig;
