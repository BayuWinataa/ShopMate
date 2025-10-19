import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import AddressesClient from '@/components/dashboard/AddressesClient';
import { Separator } from '@/components/ui/separator';

export const metadata = { title: 'Alamat · Dashboard' };

export default async function AddressPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login?next=/dashboard/address');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Alamat</h1>
        <p className="mt-1 text-sm text-muted-foreground">Kelola alamat pengiriman Anda.</p>
      </div>
      <Separator />
      <AddressesClient />
    </div>
  );
}
