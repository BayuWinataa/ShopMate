'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
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

export default function ProductCreateDialog({ onSuccess }) {
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

			// Fetch the last product ID
			const { data: lastProduct, error: fetchError } = await supabase.from('Products').select('id').order('id', { ascending: false }).limit(1).single();

			if (fetchError) {
				setError('Gagal mengambil ID terakhir produk.');
				return;
			}

			const newId = lastProduct ? lastProduct.id + 1 : 1; // Default to 1 if no products exist

			const payload = {
				id: newId, // Set the new ID
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
				// Handle duplicate key error (sequence ID out of sync)
				if (insertError.code === '23505' && /pkey|_pkey/i.test(insertError.message || '')) {
					setError('Gagal menambahkan: Primary key sudah terpakai. Kemungkinan sequence kolom id tidak sinkron. ' + 'Silakan reset sequence ke MAX(id)+1 atau ke 40 (jika ingin mulai dari 40) lewat SQL Editor Supabase.');
				} else {
					setError(insertError.message || 'Gagal menambahkan produk.');
				}
				return;
			}

			// Reset form
			setNama('');
			setKategori('');
			setHarga('');
			setGambar('');
			setDeskripsi('');
			setLongDeskripsi('');
			setTags('');

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
				<Button variant="pressViolet">Tambah Produk</Button>
			</DialogTrigger>
			<DialogContent showCloseButton={false} className="w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
				<DialogHeader className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3">
					<DialogTitle className="text-lg sm:text-xl text-violet-900">Tambah Produk</DialogTitle>
					<DialogDescription className="text-sm text-violet-600">Isi detail produk kemudian simpan untuk menambahkan ke katalog.</DialogDescription>
				</DialogHeader>

				{/* Separator */}
				<div className="h-px bg-border/80" />

				{/* Body scrollable */}
				<div className="px-4 sm:px-5 py-4">
					<form id="product-create-form" onSubmit={onSubmit} className="space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="nama" className="text-violet-600 text-sm sm:text-base">
									Nama<span className="text-rose-600">*</span>
								</Label>
								<Input
									id="nama"
									className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1 h-10 sm:h-11"
									value={nama}
									onChange={(e) => setNama(e.target.value)}
									placeholder="Contoh: Laptop XYZ"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="kategori" className="text-violet-600 text-sm sm:text-base">
									Kategori
								</Label>
								<Input
									id="kategori"
									className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1 h-10 sm:h-11"
									value={kategori}
									onChange={(e) => setKategori(e.target.value)}
									placeholder="Contoh: Elektronik"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="harga" className="text-violet-600 text-sm sm:text-base">
								Harga (IDR)<span className="text-rose-600">*</span>
							</Label>
							<Input
								id="harga"
								className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1 h-10 sm:h-11"
								type="number"
								min="0"
								value={harga}
								onChange={(e) => setHarga(e.target.value)}
								placeholder="2000000"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="gambar" className="text-violet-600 text-sm sm:text-base">
								URL Gambar
							</Label>
							<Input
								id="gambar"
								className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1 h-10 sm:h-11"
								value={gambar}
								onChange={(e) => setGambar(e.target.value)}
								placeholder="https://..."
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="deskripsi" className="text-violet-600 text-sm sm:text-base">
								Deskripsi
							</Label>
							<Textarea
								id="deskripsi"
								className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1 min-h-[80px] sm:min-h-[100px] resize-none"
								value={deskripsi}
								onChange={(e) => setDeskripsi(e.target.value)}
								placeholder="Deskripsi singkat produk"
								rows={3}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="longDeskripsi" className="text-violet-600 text-sm sm:text-base">
								Deskripsi Panjang
							</Label>
							<Textarea
								id="longDeskripsi"
								className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1 min-h-[100px] sm:min-h-[120px] resize-none"
								value={longDeskripsi}
								onChange={(e) => setLongDeskripsi(e.target.value)}
								placeholder="Detail lengkap produk"
								rows={5}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="tags" className="text-violet-600 text-sm sm:text-base">
								Tags (pisahkan dengan koma)
							</Label>
							<Input
								id="tags"
								className="text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1 h-10 sm:h-11"
								value={tags}
								onChange={(e) => setTags(e.target.value)}
								placeholder="baru, promo, limited"
							/>
						</div>

						{error && <p className="text-sm text-rose-600 bg-rose-50 p-3 rounded-md">{error}</p>}
					</form>
				</div>

				{/* Separator */}
				<div className="h-px bg-border/80" />

				{/* Footer */}
				<div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 px-4 sm:px-5 py-4 border-t bg-gray-50">
					<DialogClose asChild>
						<Button type="button" variant="outline" className="w-full sm:w-auto order-2 sm:order-1">
							Batal
						</Button>
					</DialogClose>
					<Button type="submit" variant="pressViolet" disabled={!canSubmit || loading} onClick={() => document.getElementById('product-create-form')?.requestSubmit()} className="w-full sm:w-auto order-1 sm:order-2">
						{loading ? 'Menyimpan...' : 'Simpan'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
