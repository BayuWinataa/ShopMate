'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

function parseTags(input) {
	if (!input) return null; // store null if empty
	const raw = String(input).trim();
	let arr = [];
	if (raw.startsWith('[') && raw.endsWith(']')) {
		try {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) {
				arr = parsed.map((s) => String(s).trim()).filter(Boolean);
			}
		} catch {}
	}
	if (!arr.length) {
		arr = raw
			.split(',')
			.map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
			.filter(Boolean);
	}
	return arr.length ? arr : null;
}

function stringifyTagsForInput(val) {
	try {
		if (!val) return '';
		if (Array.isArray(val)) return val.join(',');
		if (typeof val === 'string') {
			// try parse JSON string
			const parsed = JSON.parse(val);
			if (Array.isArray(parsed)) return parsed.join(',');
			return val; // raw string fallback
		}
		return '';
	} catch {
		return String(val);
	}
}

export default function ProductEditDialog({ product, onSuccess }) {
	const router = useRouter();
	const supabase = useMemo(() => createSupabaseBrowserClient(), []);

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const [nama, setNama] = useState(product?.nama || '');
	const [kategori, setKategori] = useState(product?.kategori || '');
	const [harga, setHarga] = useState(product?.harga ?? '');
	const [gambar, setGambar] = useState(product?.gambar || product?.image || '');
	const [deskripsi, setDeskripsi] = useState(product?.deskripsi || '');
	const [longDeskripsi, setLongDeskripsi] = useState(product?.longDeskripsi || '');
	const [tags, setTags] = useState(stringifyTagsForInput(product?.tags));

	const canSubmit = nama.trim() && Number.isFinite(Number(harga)) && Number(harga) >= 0;

	async function onSubmit(e) {
		e.preventDefault();
		if (!canSubmit) return;

		try {
			setLoading(true);
			setError('');

			const payload = {
				nama: nama.trim(),
				kategori: kategori.trim() || null,
				harga: Number(harga),
				gambar: gambar.trim() || null,
				deskripsi: deskripsi.trim() || null,
				longDeskripsi: longDeskripsi.trim() || null,
				tags: parseTags(tags),
			};

			const { error: updateError } = await supabase.from('Products').update(payload).eq('id', product.id).select('id').single();

			if (updateError) {
				setError(updateError.message || 'Gagal memperbarui produk.');
				return;
			}

			setOpen(false);
			if (onSuccess) onSuccess();
		} catch (err) {
			setError(err?.message || 'Terjadi kesalahan.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" variant="pressViolet">
					Edit
				</Button>
			</DialogTrigger>
			<DialogContent showCloseButton={false} className="w-[calc(100%-1rem)] sm:max-w-xl max-h-[88vh] overflow-y-auto p-0">
				<DialogHeader className="px-5 pt-5 pb-3">
					<DialogTitle className="text-violet-900">Edit Produk</DialogTitle>
					<DialogDescription className="text-violet-600">Ubah data produk lalu simpan untuk memperbarui.</DialogDescription>
				</DialogHeader>

				{/* Separator */}
				<div className="h-px bg-border/80" />

				{/* Body scrollable */}
				<div className="px-5 py-4">
					<form id="product-edit-form" onSubmit={onSubmit} className="space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="nama-edit" className="text-violet-600">
									Nama<span className="text-rose-600">*</span>
								</Label>
								<Input
									id="nama-edit"
									className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1"
									value={nama}
									onChange={(e) => setNama(e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="kategori-edit" className="text-violet-600">
									Kategori
								</Label>
								<Input
									id="kategori-edit"
									className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1"
									value={kategori}
									onChange={(e) => setKategori(e.target.value)}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label htmlFor="harga-edit" className="text-violet-600">
									Harga (IDR)<span className="text-rose-600">*</span>
								</Label>
								<Input
									id="harga-edit"
									className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1"
									type="number"
									min="0"
									value={harga}
									onChange={(e) => setHarga(e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2" />
							<div className="space-y-2" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="gambar-edit" className="text-violet-600">
								URL Gambar
							</Label>
							<Input id="gambar-edit" className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1" value={gambar} onChange={(e) => setGambar(e.target.value)} />
						</div>

						<div className="space-y-2">
							<Label htmlFor="deskripsi-edit" className="text-violet-600">
								Deskripsi
							</Label>
							<Textarea
								id="deskripsi-edit"
								className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1"
								value={deskripsi}
								onChange={(e) => setDeskripsi(e.target.value)}
								rows={3}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="longDeskripsi-edit" className="text-violet-600">
								Deskripsi Panjang
							</Label>
							<Textarea
								id="longDeskripsi-edit"
								className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1"
								value={longDeskripsi}
								onChange={(e) => setLongDeskripsi(e.target.value)}
								rows={5}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="tags-edit" className="text-violet-600">
								Tags (pisahkan dengan koma)
							</Label>
							<Input
								id="tags-edit"
								className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1"
								value={tags}
								onChange={(e) => setTags(e.target.value)}
								placeholder="baru, promo, limited"
							/>
						</div>

						{error && <p className="text-sm text-rose-600">{error}</p>}
					</form>
				</div>

				{/* Separator */}
				<div className="h-px bg-border/80" />

				{/* Footer */}
				<DialogFooter className="px-5 py-4">
					<DialogClose asChild>
						<Button type="button" variant="pressViolet">
							Batal
						</Button>
					</DialogClose>
					<Button type="submit" variant="pressViolet" disabled={!canSubmit || loading} onClick={() => document.getElementById('product-edit-form')?.requestSubmit()}>
						{loading ? 'Menyimpan...' : 'Simpan'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
