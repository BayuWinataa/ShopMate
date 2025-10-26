export default function robots() {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: ['/api/', '/admin/', '/dashboard/', '/auth/'],
			},
			{
				userAgent: 'Googlebot',
				allow: '/',
				disallow: ['/api/', '/admin/', '/dashboard/', '/auth/'],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
