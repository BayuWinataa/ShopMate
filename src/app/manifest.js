export default function manifest() {
	return {
		name: 'ShopMate AI - E-commerce dengan AI Assistant',
		short_name: 'ShopMate',
		description: 'Platform e-commerce modern dengan AI assistant untuk pengalaman belanja yang lebih cerdas',
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#7c3aed',
		icons: [
			{
				src: '/icon-192x192.svg',
				sizes: '192x192',
				type: 'image/svg+xml',
			},
			{
				src: '/icon-512x512.svg',
				sizes: '512x512',
				type: 'image/svg+xml',
			},
			{
				src: '/icon-192x192.svg',
				sizes: '192x192',
				type: 'image/svg+xml',
				purpose: 'maskable',
			},
			{
				src: '/icon-512x512.svg',
				sizes: '512x512',
				type: 'image/svg+xml',
				purpose: 'maskable',
			},
		],
		categories: ['shopping', 'e-commerce', 'ai'],
		shortcuts: [
			{
				name: 'Produk',
				short_name: 'Produk',
				description: 'Lihat katalog produk',
				url: '/products',
				icons: [{ src: '/icon-192x192.svg', sizes: '96x96', type: 'image/svg+xml' }],
			},
			{
				name: 'AI Chat',
				short_name: 'Chat',
				description: 'Chat dengan AI assistant',
				url: '/chat',
				icons: [{ src: '/icon-192x192.svg', sizes: '96x96', type: 'image/svg+xml' }],
			},
		],
	};
}
