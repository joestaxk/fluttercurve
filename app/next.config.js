/** @type {import('next').NextConfig} */
const nextConfig = {    
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.fluttercurve.com',
                port: '',
                pathname: '/private/user/**',
            },
        ],
        // domains: ["localhost"]
    },
}

module.exports = nextConfig
