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
			<ShoppingCart size={32} className="btn-press cursor-pointer px-1 py-1" />
			{totalQty > 0 && <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1.5 text-[10px] font-semibold text-white">{totalQty}</span>}
		</Link>
	);
}
