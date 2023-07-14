/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
        // superjson plugin automatically nextjs to superJson (especially needed here for sanitizing date from database)
        swcPlugins: [["next-superjson-plugin", {}]],
    },
    images: {
        domains: [
            "res.cloudinary.com",
            "avatars.githubusercontent.com",
            "lh3.googleusercontent.com"
        ]
    }
}

module.exports = nextConfig
