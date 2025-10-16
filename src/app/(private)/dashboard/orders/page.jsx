import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import OrdersClient from '@/components/cart/OrdersClient';
import { Separator } from '@/components/ui/separator';

export const metadata = { title: 'Orders · Dashboard' };

export default async function OrdersPage() {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		redirect('/login?next=/dashboard/orders');
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl md:text-3xl font-bold tracking-tight">Orders</h1>
				<p className="mt-1 text-sm text-muted-foreground">Daftar Riwayat pesanan kamu.</p>
			</div>

			<Separator />
			<OrdersClient />
		</div>
	);
}
