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
		<Button className={`text-base ${loading ? 'cursor-not-allowed ' : ''} `} disabled={loading} onClick={handleClick} variant="pressPurple">
			{!isAuthenticated ? (
				<>
					<span className="sm:hidden">Login</span>
					<span className="hidden sm:inline">Login untuk Tambah ke Keranjang</span>
				</>
			) : (
				<>
					<span className="sm:hidden">Tambah</span>
					<span className="hidden sm:inline">Tambah ke Keranjang</span>
				</>
			)}
		</Button>
	);
}
