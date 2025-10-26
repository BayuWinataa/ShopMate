import { createClient } from '@supabase/supabase-js';
import { createSlug } from '@/lib/slugify';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function sitemap() {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

	// Static routes
	const routes = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1.0,
		},
		{
			url: `${baseUrl}/products`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.9,
		},
		{
			url: `${baseUrl}/chat`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/cart`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.6,
		},
		{
			url: `${baseUrl}/login`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.5,
		},
		{
			url: `${baseUrl}/register`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.5,
		},
	];

	// Dynamic product routes
	try {
		const { data: products, error } = await supabase.from('Products').select('nama, updated_at');

		if (!error && products) {
			const productRoutes = products.map((product) => ({
				url: `${baseUrl}/products/${createSlug(product.nama)}`,
				lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
				changeFrequency: 'weekly',
				priority: 0.7,
			}));

			return [...routes, ...productRoutes];
		}
	} catch (err) {
		console.error('Error generating sitemap:', err);
	}

	return routes;
}
