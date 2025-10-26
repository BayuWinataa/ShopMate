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

export default function ProductEditDialog({ product }) {
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
			router.refresh();
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
			<DialogContent showCloseButton={false} className="w-[calc(100%-1rem)] sm:max-w-xl max-h-[88vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Produk</DialogTitle>
					<DialogDescription>Ubah data produk lalu simpan untuk memperbarui.</DialogDescription>
				</DialogHeader>

				<form onSubmit={onSubmit} className="space-y-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="nama-edit">
								Nama<span className="text-rose-600">*</span>
							</Label>
							<Input id="nama-edit" value={nama} onChange={(e) => setNama(e.target.value)} required />
						</div>
						<div className="space-y-2">
							<Label htmlFor="kategori-edit">Kategori</Label>
							<Input id="kategori-edit" value={kategori} onChange={(e) => setKategori(e.target.value)} />
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label htmlFor="harga-edit">
								Harga (IDR)<span className="text-rose-600">*</span>
							</Label>
							<Input id="harga-edit" type="number" min="0" value={harga} onChange={(e) => setHarga(e.target.value)} required />
						</div>
						<div className="space-y-2" />
						<div className="space-y-2" />
					</div>

					<div className="space-y-2">
						<Label htmlFor="gambar-edit">URL Gambar</Label>
						<Input id="gambar-edit" value={gambar} onChange={(e) => setGambar(e.target.value)} />
					</div>

					<div className="space-y-2">
						<Label htmlFor="deskripsi-edit">Deskripsi</Label>
						<Textarea id="deskripsi-edit" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} rows={3} />
					</div>

					<div className="space-y-2">
						<Label htmlFor="longDeskripsi-edit">Deskripsi Panjang</Label>
						<Textarea id="longDeskripsi-edit" value={longDeskripsi} onChange={(e) => setLongDeskripsi(e.target.value)} rows={5} />
					</div>

					<div className="space-y-2">
						<Label htmlFor="tags-edit">Tags (pisahkan dengan koma)</Label>
						<Input id="tags-edit" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="baru, promo, limited" />
					</div>

					{error && <p className="text-sm text-rose-600">{error}</p>}

					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="outline">
								Batal
							</Button>
						</DialogClose>
						<Button type="submit" variant="pressViolet" disabled={!canSubmit || loading}>
							{loading ? 'Menyimpan...' : 'Simpan'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
