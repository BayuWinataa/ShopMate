'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

function parseTags(input) {
	if (!input) return null; // store null if empty

	// If user entered JSON array (e.g., ["a","b"]) try to parse it
	const raw = String(input).trim();
	let arr = [];
	if (raw.startsWith('[') && raw.endsWith(']')) {
		try {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) {
				arr = parsed.map((s) => String(s).trim()).filter(Boolean);
			}
		} catch {
			// fall back to comma split
		}
	}
	if (!arr.length) {
		arr = raw
			.split(',')
			.map((s) => s.trim().replace(/^['"]|['"]$/g, '')) // strip surrounding quotes
			.filter(Boolean);
	}
	// Return an array for Postgres text[] column
	return arr.length ? arr : null;
}

export default function ProductCreateDialog() {
	const router = useRouter();
	const supabase = useMemo(() => createSupabaseBrowserClient(), []);

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const [nama, setNama] = useState('');
	const [kategori, setKategori] = useState('');
	const [harga, setHarga] = useState('');
	const [gambar, setGambar] = useState('');
	const [deskripsi, setDeskripsi] = useState('');
	const [longDeskripsi, setLongDeskripsi] = useState('');
	const [tags, setTags] = useState('');

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

			const { error: insertError } = await supabase.from('Products').insert([payload]).select('id').single();

			if (insertError) {
				// Tangani error duplicate key (sequence id tidak sinkron)
				if (insertError.code === '23505' && /pkey|_pkey/i.test(insertError.message || '')) {
					setError('Gagal menambahkan: Primary key sudah terpakai. Kemungkinan sequence kolom id tidak sinkron. ' + 'Silakan reset sequence ke MAX(id)+1 atau ke 40 (jika ingin mulai dari 40) lewat SQL Editor Supabase.');
				} else {
					setError(insertError.message || 'Gagal menambahkan produk.');
				}
				return;
			}

			// reset form
			setNama('');
			setKategori('');
			setHarga('');
			setGambar('');
			setDeskripsi('');
			setLongDeskripsi('');
			setTags('');

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
				<Button variant="pressViolet">Tambah Produk</Button>
			</DialogTrigger>
			<DialogContent showCloseButton={false} className="w-[calc(100%-1rem)] sm:max-w-xl max-h-[88vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-violet-900">Tambah Produk</DialogTitle>
					<DialogDescription className="text-violet-600">Isi detail produk kemudian simpan untuk menambahkan ke katalog.</DialogDescription>
				</DialogHeader>

				<form onSubmit={onSubmit} className="space-y-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="nama" className="text-violet-600">
								Nama<span className="text-rose-600">*</span>
							</Label>
							<Input
								id="nama"
								className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1"
								value={nama}
								onChange={(e) => setNama(e.target.value)}
								placeholder="Contoh: Laptop XYZ"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="kategori" className="text-violet-600">
								Kategori
							</Label>
							<Input
								id="kategori"
								className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1"
								value={kategori}
								onChange={(e) => setKategori(e.target.value)}
								placeholder="Contoh: Elektronik"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label htmlFor="harga" className="text-violet-600">
								Harga (IDR)<span className="text-rose-600">*</span>
							</Label>
							<Input
								id="harga"
								className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1"
								type="number"
								min="0"
								value={harga}
								onChange={(e) => setHarga(e.target.value)}
								placeholder="2000000"
								required
							/>
						</div>
						<div className="space-y-2" />
						<div className="space-y-2" />
					</div>

					<div className="space-y-2">
						<Label htmlFor="gambar" className="text-violet-600">
							URL Gambar
						</Label>
						<Input
							id="gambar"
							className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1"
							value={gambar}
							onChange={(e) => setGambar(e.target.value)}
							placeholder="https://..."
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="deskripsi" className="text-violet-600">
							Deskripsi
						</Label>
						<Textarea
							id="deskripsi"
							className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1"
							value={deskripsi}
							onChange={(e) => setDeskripsi(e.target.value)}
							placeholder="Deskripsi singkat produk"
							rows={3}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="longDeskripsi" className="text-violet-600">
							Deskripsi Panjang
						</Label>
						<Textarea
							id="longDeskripsi"
							className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1"
							value={longDeskripsi}
							onChange={(e) => setLongDeskripsi(e.target.value)}
							placeholder="Detail lengkap produk"
							rows={5}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="tags" className="text-violet-600">
							Tags (pisahkan dengan koma)
						</Label>
						<Input
							id="tags"
							className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1"
							value={tags}
							onChange={(e) => setTags(e.target.value)}
							placeholder="baru, promo, limited"
						/>
					</div>

					{error && <p className="text-sm text-rose-600">{error}</p>}

					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="pressPurple">
								Batal
							</Button>
						</DialogClose>
						<Button type="submit" variant="pressPurple" >
							{loading ? 'Menyimpan...' : 'Simpan'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
