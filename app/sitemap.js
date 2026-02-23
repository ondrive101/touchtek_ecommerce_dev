import { getSitemapProducts } from "@/action/common";

const BASE_URL = 'https://touchtek.in';
const locale = 'en';

export default async function sitemap() {
  const products = await getSitemapProducts().catch(() => []);


  // Static pages
  const staticPages = [
    {
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/${locale}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/${locale}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/${locale}/warranty`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/${locale}/aboutus`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/${locale}/careers`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic product variant pages
  const productPages = products.data.payload.products.map((p) => ({
    url: `${BASE_URL}/${locale}/product/${p.category}/${p.subCategory}/${p.slug}/${p.variantId}`,
    lastModified: new Date(p.updatedAt ?? new Date()),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...productPages];
}
