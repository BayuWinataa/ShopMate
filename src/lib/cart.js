// lib/cart.js - Supabase Cart Operations
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export async function getCartItems() {
	const supabase = createSupabaseBrowserClient();

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		return { data: [], error: userError };
	}

	const { data, error } = await supabase.from('cart_items').select('*').eq('user_id', user.id).order('created_at', { ascending: false });

	return { data: data || [], error };
}

export async function addToCart(productId, quantity = 1) {
	const supabase = createSupabaseBrowserClient();

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		throw new Error('User must be authenticated to add items to cart');
	}

	// Check if item already exists
	const { data: existingItem, error: checkError } = await supabase.from('cart_items').select('*').eq('user_id', user.id).eq('product_id', productId).single();

	if (checkError && checkError.code !== 'PGRST116') {
		// PGRST116 = no rows returned
		return { data: null, error: checkError };
	}

	if (existingItem) {
		// Update existing item quantity
		const { data, error } = await supabase
			.from('cart_items')
			.update({
				quantity: existingItem.quantity + quantity,
				updated_at: new Date().toISOString(),
			})
			.eq('id', existingItem.id)
			.select()
			.single();

		return { data, error };
	} else {
		// Insert new item
		const { data, error } = await supabase
			.from('cart_items')
			.insert({
				user_id: user.id,
				product_id: productId,
				quantity: quantity,
			})
			.select()
			.single();

		return { data, error };
	}
}

export async function updateCartItemQuantity(productId, quantity) {
	const supabase = createSupabaseBrowserClient();

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		throw new Error('User must be authenticated');
	}

	if (quantity <= 0) {
		return removeFromCart(productId);
	}

	const { data, error } = await supabase
		.from('cart_items')
		.update({
			quantity,
			updated_at: new Date().toISOString(),
		})
		.eq('user_id', user.id)
		.eq('product_id', productId)
		.select()
		.single();

	return { data, error };
}

export async function removeFromCart(productId) {
	const supabase = createSupabaseBrowserClient();

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		throw new Error('User must be authenticated');
	}

	const { data, error } = await supabase.from('cart_items').delete().eq('user_id', user.id).eq('product_id', productId).select().single();

	return { data, error };
}

export async function clearCart() {
	const supabase = createSupabaseBrowserClient();

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		throw new Error('User must be authenticated');
	}

	const { data, error } = await supabase.from('cart_items').delete().eq('user_id', user.id);

	return { data, error };
}

// Migration helper - migrate localStorage cart to Supabase
export async function migrateLocalCartToSupabase() {
	const supabase = createSupabaseBrowserClient();

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		return;
	}

	try {
		// Get local cart data - try both possible keys
		let localCartData = localStorage.getItem('cart') || localStorage.getItem('shopmate.cart');
		if (!localCartData) return;

		const localItems = JSON.parse(localCartData);
		if (!Array.isArray(localItems) || localItems.length === 0) return;

		console.log('Migrating local cart items to Supabase:', localItems.length);

		// Migrate each item
		for (const item of localItems) {
			try {
				// Handle both id and product_id formats
				const productId = item.id || item.product_id;
				const quantity = item.qty || item.quantity || 1;

				if (productId) {
					await addToCart(productId.toString(), quantity);
				}
			} catch (error) {
				console.error('Failed to migrate item:', item, error);
			}
		}

		// Clear local storage after successful migration
		localStorage.removeItem('cart');
		localStorage.removeItem('shopmate.cart');
		console.log('Local cart migration completed');
	} catch (error) {
		console.error('Cart migration failed:', error);
	}
}
