'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

function formatDate(value) {
	if (!value) return '-';
	try {
		return new Date(value).toLocaleString('id-ID');
	} catch {
		return String(value);
	}
}

export default function CartItemViewDialog({ item }) {
	const [open, setOpen] = useState(false);

	if (!item) return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" variant="outline">
					Detail
				</Button>
			</DialogTrigger>
			<DialogContent showCloseButton={false} className="w-[calc(100%-1rem)] sm:max-w-lg max-h-[88vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Detail Cart Item</DialogTitle>
					<DialogDescription>Lihat informasi lengkap item keranjang.</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-1 gap-4">
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">User ID</p>
						<p className="font-medium break-all">{item.user_id ?? '-'}</p>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">Product ID</p>
						<p className="font-medium break-all">{item.product_id ?? '-'}</p>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">Quantity</p>
						<p className="font-medium">{item.quantity ?? '-'}</p>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">Dibuat</p>
						<p className="font-medium">{formatDate(item.created_at)}</p>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">Diperbarui</p>
						<p className="font-medium">{formatDate(item.updated_at)}</p>
					</div>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Tutup
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
