export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',        // block API routes
          '/admin/',      // block admin panel if any
          '/_next/',      // block Next.js internals
          '/bn/',         // block Bengali locale if not ready
          '/ar/',         // block Arabic locale if not ready
        ],
      },
    ],
    sitemap: 'https://touchtek.in/sitemap.xml',
  };
}