'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function ProductDeleteButton({ id, nama, onSuccess }) {
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
			if (onSuccess) onSuccess();
		} catch (err) {
			setError(err?.message || 'Terjadi kesalahan.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button size="sm" variant="destructive" className="text-white">
					Hapus
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="border-violet-200">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-violet-900">Hapus produk?</AlertDialogTitle>
					<AlertDialogDescription className="text-violet-600">
						{nama ? (
							<>
								Produk <span className="font-medium text-violet-900">{nama}</span> akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
							</>
						) : (
							<>Produk akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.</>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				{error && <p className="text-sm text-rose-600">{error}</p>}
				<AlertDialogFooter>
					<AlertDialogCancel disabled={loading} className="border-violet-300 text-violet-700 hover:bg-violet-50">
						Batal
					</AlertDialogCancel>
					<AlertDialogAction onClick={onDelete} disabled={loading} className="bg-rose-600 hover:bg-rose-700">
						{loading ? 'Menghapus...' : 'Hapus'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
