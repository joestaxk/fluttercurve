/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BASE_URI: 'http://localhost:3000/v1',
    },
    images: {
        // remotePatterns: [
        //     {
        //         protocol: 'http',
        //         hostname: 'localhost',
        //         port: '3000',
        //         pathname: '/private/user/**',
        //     },
        // ],

        domains: ["localhost"]
    },
}

module.exports = nextConfig
