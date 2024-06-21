const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { resolve } = require('path');

const sitemap = new SitemapStream({ hostname: 'https://tome.gg' });

const routes = [
  '/',
  '/about',
  '/contact',
  '/products',
  '/products/product-1',
];

(async () => {
  try {
    const writeStream = createWriteStream(resolve(__dirname, '..', '..', 'robots', 'development', 'sitemap.xml'));
    sitemap.pipe(writeStream);
    routes.forEach(route => {
      sitemap.write({ url: route, changefreq: 'daily', priority: 0.8 });
    });
    sitemap.end();
    await streamToPromise(sitemap);
    console.log('Sitemap generated successfully.');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
})();