'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCart } from './CartProvider';

export default function AddToCartButton({ product }) {
	const router = useRouter();
	const pathname = usePathname();
	const search = useSearchParams();
	const { addItem, setOpen, user, loading, isAuthenticated } = useCart();

	const handleClick = () => {
		const nextUrl = pathname + (search?.toString() ? `?${search.toString()}` : '');

		if (!isAuthenticated) {
			router.push(`/login?next=${encodeURIComponent(nextUrl)}`);
			return;
		}

		// Sudah login → tambahkan ke cart + buka sidebar
		addItem({
			id: product.id,
			nama: product.nama,
			harga: Number(product.harga) || 0,
			image: product.image || product.gambar || null,
		});
		setOpen(true);
	};

	return (
		<Button className={loading ? 'cursor-not-allowed ' : ''} disabled={loading} onClick={handleClick}>
			{!isAuthenticated ? 'Login untuk Tambah ke Keranjang' : 'Tambah ke Keranjang'}
		</Button>
	);
}
