/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        if (!process.env.API_PATH) {
            return [];
        }
        return [
            {
                source: '/api/:path*',
                destination: process.env.API_PATH + ':path*'
            },
            {
                source: '/signin-github',
                destination: process.env.API_PATH + 'signin-github'
            }
        ]
    }
}

module.exports = nextConfig