export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/admin/'], // Don't index private user dashboards
    },
    sitemap: 'https://rekur-app.com/sitemap.xml', // Change domain later
  };
}