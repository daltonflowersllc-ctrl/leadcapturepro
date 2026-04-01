import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://leadcapturepro.app'
  
  const routes = [
    '',
    '/about',
    '/blog',
    '/pricing',
    '/setup',
    '/terms',
    '/privacy',
    '/tcpa',
    '/licensing',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
}
