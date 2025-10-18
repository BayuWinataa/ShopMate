import './globals.css';
import CartProvider from '@/components/cart/CartProvider';
import CartSheet from '@/components/cart/CartSheet';
import { Poppins } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
	title: 'ShopMate',
	description: 'Belanja cerdas dengan bantuan AI',
};

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
});

export default function RootLayout({ children }) {
	return (
		<html lang="id">
			<body className={poppins.className}>
				<CartProvider>
					{children}
					<Toaster richColors />
					<CartSheet />
				</CartProvider>
			</body>
		</html>
	);
}
