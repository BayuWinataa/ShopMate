'use client';

import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';

export default function DebateBar({ count, disabled, isComparing, onClick }) {
	return (
		<Button onClick={onClick} disabled={disabled} variant="pressPurple" className="inline-flex w-full items-center justify-center gap-2 rounded-lg sm:rounded-xl text-sm py-2.5">
			{isComparing ? (
				<>
					<Loader2 className="h-4 w-4 animate-spin" />
					<span>AI Sedang Berdebat...</span>
				</>
			) : (
				<>
					<Sparkles className="h-4 w-4" />
					<span>Debatkan {count}/2 Produk</span>
				</>
			)}
		</Button>
	);
}
