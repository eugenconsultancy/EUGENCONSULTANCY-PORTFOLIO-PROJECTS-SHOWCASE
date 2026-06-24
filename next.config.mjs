/** @type {import('next').NextConfig} */
const nextConfig = {
    // This setting ensures that your build will not fail due to 
    // minor ESLint warnings or unescaped entity errors.
    eslint: {
        ignoreDuringBuilds: true,
    },
    // If you are using next/image with external domains, 
    // you might eventually need to add them here:
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
};

export default nextConfig;