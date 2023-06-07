/** @type {import('next').NextConfig} */
const nextConfig = {    
    images: {
        domains: ["api.fluttercurve.com"]
        // domains: ["localhost"]
    },
    output: 'export',
    env: {
        BASE_URI: 'http://localhost:3000/v1',
       PUBLIC_PATH: 'http://localhost:3000'
        //  BASE_URI: 'https://api.fluttercurve.com/v1',
        // PUBLIC_PATH: 'https://api.fluttercurve.com'
    }
}

module.exports = nextConfig