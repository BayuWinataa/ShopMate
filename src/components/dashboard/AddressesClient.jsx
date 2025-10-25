'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function AddressesClient() {
	const [addresses, setAddresses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(null); // existing address or null for create
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [addressToDelete, setAddressToDelete] = useState(null);

	const [label, setLabel] = useState('Utama');
	const [recipient, setRecipient] = useState('');
	const [phone, setPhone] = useState('');
	const [addr, setAddr] = useState('');
	const [note, setNote] = useState('');

	const resetForm = () => {
		setLabel('Utama');
		setRecipient('');
		setPhone('');
		setAddr('');
		setNote('');
		setEditing(null);
	};

	const load = async () => {
		try {
			setLoading(true);
			const res = await fetch('/api/addresses');
			const json = await res.json();
			if (!res.ok) throw new Error(json?.error || 'Gagal memuat alamat');
			setAddresses(Array.isArray(json.data) ? json.data : []);
		} catch (e) {
			toast.error(e.message);
			setAddresses([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
	}, []);

	const onCreate = () => {
		resetForm();
		setOpen(true);
	};

	const onEdit = (a) => {
		setEditing(a);
		setLabel(a.label || '');
		setRecipient(a.recipient_name || '');
		setPhone(a.phone || '');
		setAddr(a.address || '');
		setNote(a.note || '');
		setOpen(true);
	};

	const onDelete = async (a) => {
		setAddressToDelete(a);
		setDeleteConfirmOpen(true);
	};

	const confirmDelete = async () => {
		if (!addressToDelete) return;
		try {
			const res = await fetch(`/api/addresses/${addressToDelete.id}`, { method: 'DELETE' });
			const json = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(json?.error || 'Gagal menghapus alamat');
			toast.success('Alamat dihapus');
			load();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setDeleteConfirmOpen(false);
			setAddressToDelete(null);
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (!recipient.trim() || !phone.trim() || !addr.trim()) {
			toast.error('Nama penerima, No. HP, dan Alamat wajib diisi.');
			return;
		}
		try {
			const payload = { label, recipient_name: recipient, phone, address: addr, note };
			let res, json;
			if (editing) {
				res = await fetch(`/api/addresses/${editing.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
			} else {
				res = await fetch('/api/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
			}
			json = await res.json();
			if (!res.ok) throw new Error(json?.error || 'Gagal menyimpan alamat');
			toast.success('Alamat disimpan');
			setOpen(false);
			resetForm();
			load();
		} catch (e) {
			toast.error(e.message);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="text-sm text-violet-600">Kelola alamat pengiriman</div>
				<Button onClick={onCreate} variant="pressPurple" className="rounded-full">
					Tambah Alamat
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{loading ? (
					<div className="text-sm text-violet-600">Memuat…</div>
				) : addresses.length === 0 ? (
					<div className="text-sm text-violet-600">Belum ada alamat.</div>
				) : (
					addresses.map((a) => (
						<Card key={a.id} className="border-violet-100 shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-300">
							<CardContent className="p-4 space-y-2">
								<div className="flex items-center justify-between">
									<div className="font-medium text-violet-900">{a.label || 'Alamat'}</div>
									<div className="text-xs text-violet-600">{new Date(a.created_at).toLocaleDateString('id-ID')}</div>
								</div>
								<div className="text-sm">
									<div className="font-medium text-violet-900">{a.recipient_name}</div>
									<div className="text-violet-600">{a.phone}</div>
									<div className="mt-1 whitespace-pre-wrap text-violet-700">{a.address}</div>
									{a.note ? <div className="mt-1 text-violet-600">Catatan: {a.note}</div> : null}
								</div>
								<div className="flex gap-2 pt-2">
									<Button variant="pressPurple" size="sm" onClick={() => onEdit(a)} className="rounded-full flex-1">
										Edit
									</Button>
									<Button variant="pressPurple" size="sm" onClick={() => onDelete(a)} className="rounded-full flex-1 border-red-700 text-red-700 shadow-[0_4px_0_#b91c1c] hover:bg-red-50">
										Hapus
									</Button>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>

			<Dialog
				open={open}
				onOpenChange={(v) => {
					setOpen(v);
					if (!v) resetForm();
				}}
			>
				<DialogContent className="max-w-lg border-violet-200">
					<DialogHeader className="bg-gradient-to-r from-violet-50 to-purple-50 -mx-6 -mt-6 px-6 pt-6 pb-4 mb-4 border-b border-violet-100">
						<DialogTitle className="text-violet-900">{editing ? 'Edit Alamat' : 'Tambah Alamat'}</DialogTitle>
					</DialogHeader>
					<form onSubmit={onSubmit} className="space-y-3">
						<div className="grid gap-1.5">
							<Label htmlFor="label" className="text-violet-700">
								Label
							</Label>
							<Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Rumah / Kantor / Utama" className="border-violet-200 focus:border-violet-400 focus:ring-violet-200" />
						</div>
						<div className="grid gap-1.5">
							<Label htmlFor="recipient" className="text-violet-700">
								Nama Penerima
							</Label>
							<Input id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} required className="border-violet-200 focus:border-violet-400 focus:ring-violet-200" />
						</div>
						<div className="grid gap-1.5">
							<Label htmlFor="phone" className="text-violet-700">
								No. HP
							</Label>
							<Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="border-violet-200 focus:border-violet-400 focus:ring-violet-200" />
						</div>
						<div className="grid gap-1.5">
							<Label htmlFor="addr" className="text-violet-700">
								Alamat
							</Label>
							<Textarea id="addr" value={addr} onChange={(e) => setAddr(e.target.value)} required className="border-violet-200 focus:border-violet-400 focus:ring-violet-200" />
						</div>
						<div className="grid gap-1.5">
							<Label htmlFor="note" className="text-violet-700">
								Catatan (opsional)
							</Label>
							<Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} className="border-violet-200 focus:border-violet-400 focus:ring-violet-200" />
						</div>
						<DialogFooter className="gap-2">
							<Button type="button" variant="pressPurple" onClick={() => setOpen(false)} className="rounded-full border-gray-700 text-gray-700 shadow-[0_4px_0_#374151] hover:bg-gray-50">
								Batal
							</Button>
							<Button type="submit" variant="pressPurple" className="rounded-full">
								Simpan
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
				<AlertDialogContent className="border-red-200">
					<AlertDialogHeader className="bg-gradient-to-r from-red-50 to-orange-50 -mx-6 -mt-6 px-6 pt-6 pb-4 mb-4 border-b border-red-100">
						<AlertDialogTitle className="text-red-900">Konfirmasi Hapus</AlertDialogTitle>
						<AlertDialogDescription className="text-red-700">
							Apakah Anda yakin ingin menghapus alamat <span className="font-semibold">{addressToDelete?.label || 'ini'}</span>? Tindakan ini tidak dapat dibatalkan.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="gap-2">
						<Button variant="pressPurple" onClick={() => setDeleteConfirmOpen(false)} className="rounded-full border-gray-700 text-gray-700 shadow-[0_4px_0_#374151] hover:bg-gray-50">
							Batal
						</Button>
						<Button variant="pressPurple" onClick={confirmDelete} className="rounded-full border-red-700 text-red-700 shadow-[0_4px_0_#b91c1c] hover:bg-red-50">
							Hapus
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
