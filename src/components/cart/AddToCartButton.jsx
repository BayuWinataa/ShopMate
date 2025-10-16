'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCart } from './CartProvider';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function AddToCartButton({ product }) {
	const router = useRouter();
	const pathname = usePathname();
	const search = useSearchParams();
	const { addItem, setOpen } = useCart();
	const supabase = createSupabaseBrowserClient();

	const [authChecked, setAuthChecked] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [checking, setChecking] = useState(true);

	useEffect(() => {
		let mounted = true;

		// Check initial auth state
		const checkAuth = async () => {
			try {
				const {
					data: { user },
					error,
				} = await supabase.auth.getUser();
				if (mounted) {
					setIsLoggedIn(!error && !!user);
					setAuthChecked(true);
					setChecking(false);
				}
			} catch {
				if (mounted) {
					setIsLoggedIn(false);
					setAuthChecked(true);
					setChecking(false);
				}
			}
		};

		checkAuth();

		// Listen for auth state changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (mounted) {
				setIsLoggedIn(!!session?.user);
				setAuthChecked(true);
				setChecking(false);
			}
		});

		return () => {
			mounted = false;
			subscription?.unsubscribe();
		};
	}, [supabase]);

	const handleClick = () => {
		const nextUrl = pathname + (search?.toString() ? `?${search.toString()}` : '');

		if (!isLoggedIn) {
			router.push(`/login?next=${encodeURIComponent(nextUrl)}`);
			return;
		}

		// Sudah login → tambahkan ke cart + buka sidebar
		addItem({
			id: product.id,
			nama: product.nama,
			harga: Number(product.harga) || 0,
			image: product.image || product.gambar || null,
			qty: 1,
		});
		setOpen(true);
	};

	return (
		<Button className={checking ? 'cursor-not-allowed ' : ''} disabled={checking} onClick={handleClick}>
			Tambah ke Keranjang
		</Button>
	);
}
