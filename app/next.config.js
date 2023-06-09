/** @type {import('next').NextConfig} */
const nextConfig = {    
    images: {
        // domains: ["api.fluttercurve.com"],
        unoptimized: true,
        // domains: ["localhost"]
    },
    // output: 'export',
    env: {
        BASE_URI: 'http://localhost:3000/v1',
       PUBLIC_PATH: 'http://localhost:3000',
        //  BASE_URI: 'https://api.fluttercurve.com/v1',
        // PUBLIC_PATH: 'https://api.fluttercurve.com',
        MAIN_URL: 'https://fluttercurve.com',
        MAIN_APP_URL: 'https://app.fluttercurve.com'
    }
}

module.exports = nextConfig