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
		const { data: products, error } = await supabase.from('Products').select('id, nama, deskripsi, longDeskripsi, harga, gambar, image, kategori');

		if (error || !products) {
			return {
				title: 'Produk tidak ditemukan',
				description: 'Produk yang Anda cari tidak tersedia.',
			};
		}

		const product = products.find((p) => createSlug(p.nama) === slug);

		if (!product) {
			return {
				title: 'Produk tidak ditemukan',
				description: 'Produk yang Anda cari tidak tersedia.',
			};
		}

		const productImage = product.gambar || product.image || '/images/product-placeholder.jpg';
		const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products/${slug}`;
		const description = product.deskripsi?.slice(0, 155) || product.longDeskripsi?.slice(0, 155) || `Beli ${product.nama} dengan harga terbaik di ShopMate`;

		return {
			title: `${product.nama} - ${product.kategori || 'Produk'}`,
			description,
			keywords: [product.nama, product.kategori, 'belanja online', 'e-commerce', 'ShopMate'].filter(Boolean),
			alternates: {
				canonical: productUrl,
			},
			openGraph: {
				type: 'product',
				url: productUrl,
				title: `${product.nama} - ShopMate`,
				description,
				images: [
					{
						url: productImage,
						width: 800,
						height: 600,
						alt: product.nama,
					},
				],
				siteName: 'ShopMate AI',
			},
			twitter: {
				card: 'summary_large_image',
				title: `${product.nama} - ShopMate`,
				description,
				images: [productImage],
			},
			other: {
				'product:price:amount': product.harga,
				'product:price:currency': 'IDR',
			},
		};
	} catch (err) {
		console.error('Error generating metadata:', err);
		return {
			title: 'Produk tidak ditemukan',
			description: 'Produk yang Anda cari tidak tersedia.',
		};
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

		// Structured data for product
		const productStructuredData = {
			'@context': 'https://schema.org',
			'@type': 'Product',
			name: product.nama,
			image: imgSrc,
			description: product.deskripsi || product.longDeskripsi || '',
			sku: `PROD-${product.id}`,
			brand: {
				'@type': 'Brand',
				name: 'ShopMate',
			},
			offers: {
				'@type': 'Offer',
				url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products/${slug}`,
				priceCurrency: 'IDR',
				price: product.harga,
				availability: product.stok > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
				itemCondition: 'https://schema.org/NewCondition',
			},
			category: product.kategori,
		};

		// Add rating if available
		if (product.rating) {
			productStructuredData.aggregateRating = {
				'@type': 'AggregateRating',
				ratingValue: product.rating,
				reviewCount: product.reviewCount || 1,
			};
		}

		return (
			<>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(productStructuredData),
					}}
				/>
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
			</>
		);
	} catch (err) {
		console.error('Error fetching product:', err);
		return notFound();
	}
}
