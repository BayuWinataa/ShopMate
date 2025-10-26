import './globals.css';
import CartProvider from '@/components/cart/CartProvider';
import CartSheet from '@/components/cart/CartSheet';
import AuthProviderWrapper from '@/components/providers/AuthProviderWrapper';
import { Poppins } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
	title: {
		default: 'ShopMate AI - Belanja Cerdas dengan Bantuan AI',
		template: '%s | ShopMate AI',
	},
	description: 'ShopMate adalah platform e-commerce modern dengan AI assistant yang membantu Anda menemukan produk terbaik, memberikan rekomendasi personal, dan membuat pengalaman belanja lebih mudah dan menyenangkan.',
	keywords: ['e-commerce', 'belanja online', 'AI shopping assistant', 'toko online', 'belanja cerdas', 'rekomendasi produk AI', 'chat AI belanja', 'ShopMate'],
	authors: [{ name: 'ShopMate Team' }],
	creator: 'ShopMate',
	publisher: 'ShopMate',
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: 'website',
		locale: 'id_ID',
		url: '/',
		siteName: 'ShopMate AI',
		title: 'ShopMate AI - Belanja Cerdas dengan Bantuan AI',
		description: 'Platform e-commerce modern dengan AI assistant. Temukan produk terbaik dengan rekomendasi personal dari AI.',
		images: [
			{
				url: '/og-image.png',
				width: 1200,
				height: 630,
				alt: 'ShopMate AI - E-commerce dengan AI Assistant',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'ShopMate AI - Belanja Cerdas dengan Bantuan AI',
		description: 'Platform e-commerce modern dengan AI assistant. Temukan produk terbaik dengan rekomendasi personal dari AI.',
		images: ['/og-image.png'],
		creator: '@shopmate',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	verification: {
		// google: 'your-google-verification-code',
		// yandex: 'your-yandex-verification-code',
	},
};

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	display: 'swap',
	preload: true,
});

export default function RootLayout({ children }) {
	return (
		<html lang="id" suppressHydrationWarning>
			<body className={poppins.className} suppressHydrationWarning>
				<AuthProviderWrapper>
					<CartProvider>
						{children}
						<Toaster richColors />
						<CartSheet />
					</CartProvider>
				</AuthProviderWrapper>
			</body>
		</html>
	);
}
