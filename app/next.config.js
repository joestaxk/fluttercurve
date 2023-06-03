/** @type {import('next').NextConfig} */
const nextConfig = {

    env: {
        BASE_URI: 'http://localhost:3000/v1',
        PUBLIC_PATH: 'http://localhost:3000'
        // BASE_URI: 'https://api.fluttercurve.com/v1',
        // PUBLIC_PATH: 'https://api.fluttercurve.com'
    },
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
