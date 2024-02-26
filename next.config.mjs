/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['puppeteer-core'],
    },
    images: {
        remotePatterns: [
            {
            protocol: "https",
            hostname: "*.githubusercontent.com",
            port: "",
            pathname: "**",
            },
        ],
    },
};

export default nextConfig;
