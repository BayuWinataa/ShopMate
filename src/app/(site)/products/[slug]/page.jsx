// app/products/[slug]/page.jsx
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { createSlug } from '@/lib/slugify';

// Components
import ProductBreadcrumb from '@/components/product-detail/ProductBreadcrumb';
import ProductHero from '@/components/product-detail/ProductHero';
import ProductGallery from '@/components/product-detail/ProductGallery';
import ProductDetailCard from '@/components/product-detail/ProductDetailCard';
import PurchasePanel from '@/components/product-detail/PurchasePanel';
import RelatedProducts from '@/components/product-detail/RelatedProducts';

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Constants
const fallbackImg = '/images/product-placeholder.jpg';

// ---- SSG (opsional tapi disarankan)
export async function generateStaticParams() {
	try {
		const { data: products, error } = await supabase.from('Products').select('nama');

		if (error) {
			console.error('Error fetching products for static params:', error);
			return [];
		}

		return (products || []).map((p) => ({ slug: createSlug(p.nama) }));
	} catch (err) {
		console.error('Error in generateStaticParams:', err);
		return [];
	}
}

export async function generateMetadata({ params }) {
	try {
		const resolvedParams = await params;
		const slug = resolvedParams.slug;

		// Get all products and find by slug
		const { data: products, error } = await supabase.from('Products').select('id, nama, deskripsi, longDeskripsi');

		if (error || !products) {
			return { title: 'Produk tidak ditemukan · ShopMate' };
		}

		const product = products.find((p) => createSlug(p.nama) === slug);

		if (!product) {
			return { title: 'Produk tidak ditemukan · ShopMate' };
		}

		return {
			title: `${product.nama} · ShopMate`,
			description: product.deskripsi?.slice(0, 160) || product.longDeskripsi?.slice(0, 160) || `Beli ${product.nama} di ShopMate`,
			openGraph: {
				title: `${product.nama} · ShopMate`,
				description: product.deskripsi?.slice(0, 200) || product.longDeskripsi?.slice(0, 200) || `Beli ${product.nama} di ShopMate`,
			},
		};
	} catch (err) {
		console.error('Error generating metadata:', err);
		return { title: 'Produk tidak ditemukan · ShopMate' };
	}
}

// ---- Page (SERVER COMPONENT, tanpa 'use client')
export default async function ProductDetail({ params }) {
	const { slug } = await params;

	try {
		// Fetch all products and find by slug
		const { data: products, error: productsError } = await supabase.from('Products').select('*');

		if (productsError || !products) {
			return notFound();
		}

		// Find product by slug
		const product = products.find((p) => createSlug(p.nama) === slug);

		if (!product) {
			return notFound();
		}

		// Fetch related products
		const { data: related, error: relatedError } = await supabase.from('Products').select('*').eq('kategori', product.kategori).neq('id', product.id).limit(4);

		if (relatedError) {
			console.error('Error fetching related products:', relatedError);
		}

		// pastikan objek minimal untuk cart
		const cartProduct = {
			id: product.id,
			nama: product.nama,
			harga: Number(product.harga) || 0,
			image: product.gambar || product.image || null,
		};

		const imgSrc = product.gambar || product.image || fallbackImg;

		// Handle tags - could be array or JSON string
		const productTags = Array.isArray(product.tags) ? product.tags : typeof product.tags === 'string' ? JSON.parse(product.tags || '[]') : [];

		return (
			<div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-white">
				<ProductBreadcrumb productName={product.nama} />

				<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<ProductHero product={product} productTags={productTags} />

					<div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
						{/* Left Column: Gallery & Details */}
						<section className="space-y-4">
							<ProductGallery imgSrc={imgSrc} productName={product.nama} />
							<ProductDetailCard longDeskripsi={product.longDeskripsi} />
						</section>

						{/* Right Column: Purchase Panel */}
						<aside className="lg:pl-2">
							<PurchasePanel product={product} cartProduct={cartProduct} />
						</aside>
					</div>

					{/* Related Products */}
					<RelatedProducts related={related} fallbackImg={fallbackImg} />
				</main>
			</div>
		);
	} catch (err) {
		console.error('Error fetching product:', err);
		return notFound();
	}
}
