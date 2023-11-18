/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        if (!process.env.API_PATH) {
            return [];
        }
        return [
            {
                source: '/api/:path*',
                destination: process.env.API_PATH + 'api/:path*'
            }
        ]
    }
}

module.exports = nextConfig