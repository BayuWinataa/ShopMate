'use client';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from './CartProvider';

export default function CartButton({ useModal = false }) {
	const { totalQty, setOpen } = useCart();

	const handleClick = (e) => {
		if (useModal) {
			e.preventDefault();
			setOpen(true);
		}
		// Jika useModal false, biarkan Link bekerja normal
	};

	return (
		<Link href="/cart" className="relative" onClick={handleClick}>
			<ShoppingCart size={40} className="border px-2 py-1 rounded-lg hover:bg-accent transition cursor-pointer" />
			{totalQty > 0 && <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">{totalQty}</span>}
		</Link>
	);
}
