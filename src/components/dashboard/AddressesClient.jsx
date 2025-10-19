'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function AddressesClient() {
	const [addresses, setAddresses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(null); // existing address or null for create

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
		if (!confirm('Hapus alamat ini?')) return;
		try {
			const res = await fetch(`/api/addresses/${a.id}`, { method: 'DELETE' });
			const json = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(json?.error || 'Gagal menghapus alamat');
			toast.success('Alamat dihapus');
			load();
		} catch (e) {
			toast.error(e.message);
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
				<div className="text-sm text-muted-foreground">Kelola alamat pengiriman</div>
				<Button onClick={onCreate}>Tambah Alamat</Button>
			</div>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{loading ? (
					<div className="text-sm text-muted-foreground">Memuat…</div>
				) : addresses.length === 0 ? (
					<div className="text-sm text-muted-foreground">Belum ada alamat.</div>
				) : (
					addresses.map((a) => (
						<Card key={a.id}>
							<CardContent className="p-4 space-y-2">
								<div className="flex items-center justify-between">
									<div className="font-medium">{a.label || 'Alamat'}</div>
									<div className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString('id-ID')}</div>
								</div>
								<div className="text-sm">
									<div className="font-medium">{a.recipient_name}</div>
									<div className="text-muted-foreground">{a.phone}</div>
									<div className="mt-1 whitespace-pre-wrap">{a.address}</div>
									{a.note ? <div className="mt-1 text-muted-foreground">Catatan: {a.note}</div> : null}
								</div>
								<div className="flex gap-2 pt-2">
									<Button variant="outline" size="sm" onClick={() => onEdit(a)}>
										Edit
									</Button>
									<Button variant="destructive" size="sm" onClick={() => onDelete(a)}>
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
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>{editing ? 'Edit Alamat' : 'Tambah Alamat'}</DialogTitle>
					</DialogHeader>
					<form onSubmit={onSubmit} className="space-y-3">
						<div className="grid gap-1.5">
							<Label htmlFor="label">Label</Label>
							<Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Rumah / Kantor / Utama" />
						</div>
						<div className="grid gap-1.5">
							<Label htmlFor="recipient">Nama Penerima</Label>
							<Input id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} required />
						</div>
						<div className="grid gap-1.5">
							<Label htmlFor="phone">No. HP</Label>
							<Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
						</div>
						<div className="grid gap-1.5">
							<Label htmlFor="addr">Alamat</Label>
							<Textarea id="addr" value={addr} onChange={(e) => setAddr(e.target.value)} required />
						</div>
						<div className="grid gap-1.5">
							<Label htmlFor="note">Catatan (opsional)</Label>
							<Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} />
						</div>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => setOpen(false)}>
								Batal
							</Button>
							<Button type="submit">Simpan</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
