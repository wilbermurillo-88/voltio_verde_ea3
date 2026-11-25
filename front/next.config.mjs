/** @type {import('next').NextConfig} */
const basePath =
  process.env.GITHUB_PAGES === "true" ? "/voltio_verde_ea3" : "";

const nextConfig = {
  output: "export",
  basePath,
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;
