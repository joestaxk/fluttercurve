/** @type {import('next').NextConfig} */
const nextConfig = {    
    images: {
        domains: ["api.fluttercurve.com"]
    },
    env: {
        //BASE_URI: 'http://localhost:3000/v1',
       // PUBLIC_PATH: 'http://localhost:3000'
         BASE_URI: 'https://api.fluttercurve.com/v1',
        PUBLIC_PATH: 'https://api.fluttercurve.com'
    },
    images: {
        domains: ["api.fluttercurve.com"]
    },
    webpack: (config) => {
      config.module.rules.push({
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      });
      return config;
    },
}

module.exports = nextConfig