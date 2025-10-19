'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function ProductDeleteButton({ id, nama }) {
	const router = useRouter();
	const supabase = useMemo(() => createSupabaseBrowserClient(), []);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const onDelete = async () => {
		try {
			setLoading(true);
			setError('');
			const { error } = await supabase.from('Products').delete().eq('id', id);
			if (error) {
				setError(error.message || 'Gagal menghapus produk.');
				return;
			}
			router.refresh();
		} catch (err) {
			setError(err?.message || 'Terjadi kesalahan.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button size="sm" variant="destructive">
					Hapus
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Hapus produk?</AlertDialogTitle>
					<AlertDialogDescription>
						{nama ? (
							<>
								Produk <span className="font-medium">{nama}</span> akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
							</>
						) : (
							<>Produk akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.</>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				{error && <p className="text-sm text-rose-600">{error}</p>}
				<AlertDialogFooter>
					<AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
					<AlertDialogAction onClick={onDelete} disabled={loading}>
						{loading ? 'Menghapus...' : 'Hapus'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
