'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
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
				<Button size="sm" variant="pressPurple">
					Detail
				</Button>
			</DialogTrigger>
			<DialogContent showCloseButton={false} className="w-[calc(100%-1rem)] sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto p-0">
				<DialogHeader className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3">
					<DialogTitle className="text-lg sm:text-xl text-violet-900">Detail Cart Item</DialogTitle>
					<DialogDescription className="text-sm text-violet-600">Lihat informasi lengkap item keranjang.</DialogDescription>
				</DialogHeader>

				{/* Separator */}
				<div className="h-px bg-border/80" />

				{/* Body */}
				<div className="px-4 sm:px-5 py-4">
					<div className="grid grid-cols-1 gap-4">
						<div className="space-y-1">
							<p className="text-xs sm:text-sm text-violet-600">User ID</p>
							<p className="font-medium break-all text-violet-900 text-sm sm:text-base">{item.user_id ?? '-'}</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs sm:text-sm text-violet-600">Product ID</p>
							<p className="font-medium break-all text-violet-900 text-sm sm:text-base">{item.product_id ?? '-'}</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs sm:text-sm text-violet-600">Quantity</p>
							<p className="font-medium text-violet-900 text-sm sm:text-base">{item.quantity ?? '-'}</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs sm:text-sm text-violet-600">Dibuat</p>
							<p className="font-medium text-violet-900 text-sm sm:text-base">{formatDate(item.created_at)}</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs sm:text-sm text-violet-600">Diperbarui</p>
							<p className="font-medium text-violet-900 text-sm sm:text-base">{formatDate(item.updated_at)}</p>
						</div>
					</div>
				</div>

				{/* Separator */}
				<div className="h-px bg-border/80" />

				{/* Footer */}
				<div className="flex justify-end px-4 sm:px-5 py-4 border-t bg-gray-50">
					<DialogClose asChild>
						<Button variant="outline" className="w-full sm:w-auto">
							Tutup
						</Button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
}
