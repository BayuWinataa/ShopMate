'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function CompareDialog({ open, onOpenChange, isComparing, comparedPair, comparisonResult, followupThread, followupInput, setFollowupInput, isFollowupLoading, onSubmitFollowup }) {
	const bodyRef = useRef(null);

	useEffect(() => {
		if (!open || !bodyRef.current) return;
		// scroll top for first result
		if (comparisonResult && !isComparing && followupThread.length === 0) {
			bodyRef.current.scrollTop = 0;
		}
		// scroll bottom for chats
		if (followupThread.length > 0) {
			requestAnimationFrame(() => {
				if (bodyRef.current) {
					bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
				}
			});
		}
	}, [open, comparisonResult, followupThread, isComparing]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange} modal>
			<DialogContent
				className="flex h-[90vh] w-[95vw] sm:h-[85vh] sm:max-w-4xl max-h-[90vh] flex-col gap-0 p-0 overflow-hidden"
				onPointerDownOutside={(e) => {
					if (window.innerWidth < 640) e.preventDefault();
				}}
				onInteractOutside={(e) => {
					if (window.innerWidth < 640) e.preventDefault();
				}}
			>
				<DialogHeader className="px-3 sm:px-5 pt-3 sm:pt-5 pb-2 flex-shrink-0 border-b border-violet-100">
					<DialogTitle className="text-sm sm:text-base font-semibold text-violet-800">Debat Produk</DialogTitle>
					{comparedPair?.length === 2 && (
						<div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
							<span className="rounded-full bg-violet-50 px-2.5 py-1 font-medium text-violet-700 ring-1 ring-violet-200">A: {comparedPair[0].nama}</span>
							<span className="rounded-full bg-violet-100 px-2.5 py-1 font-medium text-violet-800 ring-1 ring-violet-300">B: {comparedPair[1].nama}</span>
						</div>
					)}
				</DialogHeader>

				<div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto">
					<div className="px-3 sm:px-5 py-3 min-h-full">
						{isComparing ? (
							<div className="flex h-32 items-center justify-center text-violet-700">
								<div className="inline-flex items-center gap-2 rounded-lg bg-violet-100 px-3 py-2 text-sm">
									<Loader2 className="h-4 w-4 animate-spin" /> AI sedang menganalisis...
								</div>
							</div>
						) : (
							<div className="prose prose-sm sm:prose max-w-none [&>*]:my-2 sm:[&>*]:my-3 [&_p]:leading-relaxed text-sm sm:text-base break-words min-h-[200px]">
								<ReactMarkdown remarkPlugins={[remarkGfm]}>{comparisonResult || '_Belum ada ringkasan._'}</ReactMarkdown>
							</div>
						)}

						{followupThread.length > 0 && (
							<div className="mt-4 sm:mt-6 space-y-4 border-t border-violet-200 pt-4">
								{followupThread.map((m, idx) => (
									<div key={idx} className={`${m.role === 'user' ? 'bg-violet-50 border border-violet-200' : 'bg-white border border-violet-100'} rounded-xl p-4`}>
										<div className="prose prose-sm sm:prose max-w-none [&>*]:my-2 text-sm sm:text-base break-words">
											<ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				<DialogFooter className="border-t border-violet-200 bg-white/95 px-3 sm:px-5 py-2 sm:py-3 backdrop-blur flex-shrink-0">
					<form onSubmit={onSubmitFollowup} className="flex w-full items-center gap-2">
						<input
							value={followupInput}
							onChange={(e) => setFollowupInput(e.target.value)}
							placeholder="Tanya detail lanjutan tentang dua produk ini..."
							className="flex-1 rounded-xl border border-violet-300 p-3 text-sm sm:text-base text-slate-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200 min-w-0"
						/>
						<button type="submit" disabled={isFollowupLoading} className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-4 py-3 text-white transition-colors hover:bg-violet-700 disabled:bg-violet-300 min-w-[44px]">
							{isFollowupLoading ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
									<path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
								</svg>
							)}
							<span className="sr-only">Kirim</span>
						</button>
					</form>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
