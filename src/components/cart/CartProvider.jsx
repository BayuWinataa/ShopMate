// src/components/cart/CartProvider.jsx
'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { getCartItems, addToCart as addToCartDB, updateCartItemQuantity, removeFromCart as removeFromCartDB, clearCart as clearCartDB, migrateLocalCartToSupabase } from '@/lib/cart';

const CartContext = createContext(null);
const STORAGE_KEY = 'shopmate.cart'; // Untuk migrasi dari localStorage

export default function CartProvider({ children }) {
	const [items, setItems] = useState([]); // [{id, nama, harga, image, qty}]
	const [open, setOpen] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [products, setProducts] = useState([]);
	const supabase = createSupabaseBrowserClient();

	// Load products when component mounts
	useEffect(() => {
		const loadProducts = async () => {
			try {
				const { data: productsData, error } = await supabase.from('Products').select('*');

				if (error) {
					console.error('Failed to load products:', error);
					return;
				}

				setProducts(productsData || []);
			} catch (error) {
				console.error('Failed to load products:', error);
			}
		};

		loadProducts();
	}, [supabase]);

	// Get initial user and set up auth listener
	useEffect(() => {
		const getInitialUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setUser(user);
			setLoading(false);

			if (user) {
				// User is logged in, migrate from localStorage and load from Supabase
				await migrateFromLocalStorageToSupabase();
				await loadCartFromSupabase();
			} else {
				// User not logged in, clear cart (tidak boleh ada cart untuk guest)
				setItems([]);
			}
		};

		getInitialUser();

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			const newUser = session?.user || null;
			setUser(newUser);

			if (event === 'SIGNED_IN' && newUser) {
				console.log('User signed in, migrating cart data from localStorage');
				try {
					await migrateFromLocalStorageToSupabase();
					await loadCartFromSupabase();
				} catch (error) {
					console.error('Error during cart migration:', error);
				}
			} else if (event === 'SIGNED_OUT') {
				console.log('User signed out, clearing cart');
				setItems([]);
			}
		});

		return () => subscription?.unsubscribe();
	}, [supabase]);

	// Migrate localStorage cart to Supabase when user logs in
	const migrateFromLocalStorageToSupabase = async () => {
		if (!user) return;

		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return;

			const localItems = JSON.parse(raw);
			if (!Array.isArray(localItems) || localItems.length === 0) return;

			console.log('Migrating local cart items to Supabase:', localItems.length);

			// Migrate each item
			for (const item of localItems) {
				try {
					const productId = item.id;
					const quantity = item.qty || 1;

					if (productId) {
						await addToCartDB(productId.toString(), quantity);
					}
				} catch (error) {
					console.error('Failed to migrate item:', item, error);
				}
			}

			// Clear localStorage after successful migration
			localStorage.removeItem(STORAGE_KEY);
			console.log('Local cart migration completed and localStorage cleared');
		} catch (error) {
			console.error('Cart migration failed:', error);
		}
	};

	// Load cart after products are loaded
	useEffect(() => {
		if (products.length > 0 && user) {
			loadCartFromSupabase();
		}
	}, [products, user]);

	const loadCartFromSupabase = async () => {
		if (!user || products.length === 0) return;

		try {
			const { data: cartItems, error } = await getCartItems();
			if (error) {
				console.error('Failed to load cart from Supabase:', error);
				return;
			}

			// Transform cart items to include product details
			const transformedItems = cartItems
				.map((item) => {
					const product = products.find((p) => p.id.toString() === item.product_id);
					if (!product) {
						console.warn(`Product not found for ID: ${item.product_id}`);
						return null;
					}
					return {
						id: item.product_id,
						nama: product.nama,
						harga: product.harga,
						image: product.image || product.gambar || '/placeholder.jpg',
						qty: item.quantity,
					};
				})
				.filter(Boolean); // Remove null items

			setItems(transformedItems);
		} catch (error) {
			console.error('Failed to load cart from Supabase:', error);
		}
	};

	const addItem = async (product, qty = 1) => {
		// Hanya user yang sudah login yang bisa menambahkan ke keranjang
		if (!user) {
			console.warn('User must be logged in to add items to cart');
			return;
		}

		try {
			await addToCartDB(product.id.toString(), qty);
			await loadCartFromSupabase(); // Refresh cart from DB
		} catch (error) {
			console.error('Failed to add item to cart:', error);
		}
	};

	const removeItem = async (id) => {
		if (!user) return;

		try {
			await removeFromCartDB(id.toString());
			await loadCartFromSupabase(); // Refresh cart from DB
		} catch (error) {
			console.error('Failed to remove item from cart:', error);
		}
	};

	const updateQty = async (id, qty) => {
		if (!user) return;

		try {
			await updateCartItemQuantity(id.toString(), Math.max(1, qty));
			await loadCartFromSupabase(); // Refresh cart from DB
		} catch (error) {
			console.error('Failed to update cart item quantity:', error);
		}
	};

	const clear = async () => {
		if (!user) return;

		try {
			await clearCartDB();
			setItems([]);
		} catch (error) {
			console.error('Failed to clear cart:', error);
		}
	};

	const totals = useMemo(() => {
		const totalQty = items.reduce((s, it) => s + it.qty, 0);
		const totalPrice = items.reduce((s, it) => s + (it.qty || 0) * (it.harga || 0), 0);
		return { totalQty, totalPrice };
	}, [items]);

	const value = useMemo(
		() => ({
			items,
			addItem,
			removeItem,
			updateQty,
			clear,
			open,
			setOpen,
			user,
			loading,
			isAuthenticated: !!user,
			...totals,
		}),
		[items, totals, open, user, loading]
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error('useCart must be used within CartProvider');
	return ctx;
};
