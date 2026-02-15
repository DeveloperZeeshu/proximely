import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: [
                '/'
            ],
            disallow: [
                '/shop/*',
                '/auth/',
                '/api/',
                '/dashboard/'
            ],
        },
        sitemap: 'https://proximely.in/sitemap.xml',
    }
}