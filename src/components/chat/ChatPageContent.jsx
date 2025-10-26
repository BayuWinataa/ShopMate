'use client';

import { useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowRight, Loader2, ListFilter, Trash2 } from 'lucide-react';

import useChatLogic from '@/hooks/useChatLogic';
import RecList, { ProductSkeletonList } from './RecList';
import DebateBar from './DebateBar';
import MessageBubble from './MessageBubble';
import CompareDialog from './CompareDialog';
import { formatIDR } from '@/lib/formatIDR';

export default function ChatPageContent() {
	const searchParams = useSearchParams();
	const chatEndRef = useRef(null);
	const lastMessageRef = useRef(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const {
		// state
		messages,
		input,
		isLoading,
		productsLoading,
		recommendedProducts,
		comparisonList,
		isComparing,
		isModalOpen,
		comparedPair,
		comparisonResult,
		followupInput,
		followupThread,
		isFollowupLoading,
		// actions
		setInput,
		handleSubmit,
		isSelectedForCompare,
		toggleCompare,
		handleStartComparison,
		setIsModalOpen,
		setFollowupInput,
		handleFollowupSubmit,
		clearChatHistory,
	} = useChatLogic({ initialAsk: searchParams?.get('ask') || '', chatEndRef, lastMessageRef });

	return (
		<div className="h-[calc(100vh-4.1rem)] w-full bg-gradient-to-b from-slate-50 via-white to-white">
			<div className="container mx-auto h-full w-full">
				{/* MOBILE: trigger rekomendasi */}
				<motion.div
					initial={{ y: -100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5, ease: 'easeOut' }}
					className="sticky top-0 z-10 mb-2 sm:mb-3 rounded-xl border border-violet-200 bg-white/80 backdrop-blur md:hidden"
				>
					<div className="flex items-center justify-between gap-3 p-2 sm:p-3">
						<Sheet>
							<SheetTrigger asChild>
								<motion.button
									whileTap={{ scale: 0.95 }}
									whileHover={{ scale: 1.05 }}
									transition={{ type: 'spring', stiffness: 400, damping: 17 }}
									variant="pressPurple"
									size="xl"
									className="gap-1 text-xs sm:text-sm border-violet-200 text-violet-700 hover:bg-violet-50 flex"
								>
									<ListFilter className="h-4 w-4 sm:h-5 sm:w-5" />
									<span className=" ">Rekomendasi</span>
								</motion.button>
							</SheetTrigger>
							<SheetContent side="left" className="w-[80vw] sm:w-[420px] flex flex-col ">
								<SheetHeader className="flex-shrink-0">
									<SheetTitle className="text-violet-800">Produk Rekomendasi</SheetTitle>
								</SheetHeader>
								<div className="flex-1 min-h-0 flex flex-col">
									<div className="flex-1 min-h-0">
										<ScrollArea className="h-full">
											{productsLoading ? <ProductSkeletonList count={4} /> : <RecList items={recommendedProducts} formatIDR={formatIDR} isSelectedForCompare={isSelectedForCompare} toggleCompare={toggleCompare} />}
											<ScrollBar orientation="vertical" />
										</ScrollArea>
									</div>
									<div className="flex-shrink-0 px-4 py-3 border-t border-violet-200 bg-violet-50/50">
										<DebateBar count={comparisonList.length} disabled={comparisonList.length !== 2 || isComparing} isComparing={isComparing} onClick={handleStartComparison} />
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</motion.div>

				{/* 2 kolom */}
				<div className="flex flex-col md:grid h-[calc(100%-3.5rem)] sm:h-[calc(100%-2rem)] min-h-0 gap-2 sm:gap-4 md:grid-cols-[320px_1fr] lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">
					{/* LEFT (desktop) */}
					<aside className="hidden min-h-0 md:flex flex-col gap-4">
						<div className="flex flex-col h-full rounded-2xl border border-violet-200 bg-white/80 ring-1 ring-violet-200 overflow-hidden shadow-sm">
							<div className="flex-shrink-0 p-4 border-b border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50">
								<h2 className="text-xl font-semibold text-violet-800">Produk Rekomendasi</h2>
								<p className="text-sm text-violet-600">Dari jawaban AI-mu</p>
							</div>
							<div className="flex-1 min-h-0 p-4">
								<ScrollArea className="h-full pr-2">
									{productsLoading ? <ProductSkeletonList count={4} /> : <RecList items={recommendedProducts} formatIDR={formatIDR} isSelectedForCompare={isSelectedForCompare} toggleCompare={toggleCompare} />}
									<ScrollBar orientation="vertical" />
								</ScrollArea>
							</div>
							<div className="flex-shrink-0 p-4 border-t border-violet-200 bg-violet-50/50">
								<DebateBar count={comparisonList.length} disabled={comparisonList.length !== 2 || isComparing} isComparing={isComparing} onClick={handleStartComparison} />
							</div>
						</div>
					</aside>

					{/* RIGHT chat */}
					<section className="flex min-h-0 flex-col  overflow-hidden rounded-xl sm:rounded-2xl border border-violet-200 bg-white shadow-sm ring-1 ring-violet-200 h-full ">
						<div ref={chatEndRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6 ">
							<div className="mx-auto flex flex-col gap-4">
								{messages.map((m, i) => (
									<div key={`${m.role}-${i}`} ref={i === messages.length - 1 ? lastMessageRef : null}>
										<MessageBubble role={m.role} content={m.content} />
									</div>
								))}

								{isLoading && (
									<div className="flex justify-start">
										<div className="inline-flex items-center gap-2 rounded-lg sm:rounded-xl bg-violet-100 px-3 sm:px-4 py-2 sm:py-3 text-violet-700">
											<Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
											<span className="text-xs sm:text-sm">AI is thinking...</span>
										</div>
									</div>
								)}

								{messages.length === 0 && !isLoading && (
									<div className="flex items-center justify-center py-8 sm:py-12">
										<EmptyState />
									</div>
								)}
							</div>
						</div>

						{/* composer */}
						<div className="border-t border-violet-200 p-3 sm:p-4 bg-violet-50/30">
							<form onSubmit={handleSubmit} className="mx-auto flex gap-2 sm:gap-1">
								<input
									value={input}
									onChange={(e) => setInput(e.target.value)}
									placeholder="Ketik pesan Anda..."
									className="flex-1 min-h-[2.5rem] rounded-lg sm:rounded-xl border border-violet-300 px-3 py-2 sm:py-3 text-sm sm:text-base text-slate-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200 placeholder:text-slate-500 w-full"
									disabled={isLoading}
								/>
								<button
									type="submit"
									disabled={isLoading}
									className="inline-flex h-10 sm:h-12 items-center justify-center rounded-lg sm:rounded-xl bg-violet-600 px-4 sm:px-5 text-white transition-colors hover:bg-violet-700 disabled:bg-violet-300"
								>
									<svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
										<path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
									</svg>
								</button>
								<AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
									<AlertDialogTrigger asChild>
										<Button
											type="button"
											variant="pressPurple"
											size="icon"
											disabled={isLoading}
											title="Hapus riwayat chat"
											className="bg-red-500 border-red-500 text-white shadow-[0_4px_0_#dc2626] hover:bg-red-600 active:shadow-none active:translate-y-[4px]"
										>
											<Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Hapus Riwayat Chat</AlertDialogTitle>
											<AlertDialogDescription>Apakah Anda yakin ingin menghapus semua riwayat percakapan? Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Batal</AlertDialogCancel>
											<AlertDialogAction
												onClick={() => {
													clearChatHistory();
													setIsDeleteDialogOpen(false);
												}}
												className="bg-red-500 hover:bg-red-600"
											>
												Hapus
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</form>
						</div>
					</section>
				</div>
			</div>

			{/* modal compare */}
			<CompareDialog
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
				isComparing={isComparing}
				comparedPair={comparedPair}
				comparisonResult={comparisonResult}
				followupThread={followupThread}
				followupInput={followupInput}
				setFollowupInput={setFollowupInput}
				isFollowupLoading={isFollowupLoading}
				onSubmitFollowup={handleFollowupSubmit}
			/>
		</div>
	);
}

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center rounded-lg sm:rounded-2xl border border-dashed border-violet-200 bg-violet-50 px-3 sm:px-4 py-6 sm:py-10 text-center text-violet-700">
			<div className="mb-2">
				<ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
			</div>
			<p className="font-medium text-sm sm:text-base">Mulai percakapan</p>
			<p className="mt-1 max-w-sm text-xs sm:text-sm text-violet-600">Minta rekomendasi, saran budget, atau tempel spesifikasi—AI bantu merangkum.</p>
		</div>
	);
}
