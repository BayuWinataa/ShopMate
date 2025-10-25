import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Li from '@/components/site/landing/Li';

export default function InvoiceIQSection() {
	return (
		<section aria-labelledby="invoice-iq" className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<div className="mx-auto max-w-6xl rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur supports-[backdrop-filter]:backdrop-blur md:p-10">
				<div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
					<div className="max-w-2xl">
						<div className="inline-flex items-center gap-2 rounded-full bg-purple-600/10 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-600/20">
							<span className="h-1.5 w-1.5 rounded-full bg-purple-700" aria-hidden />
							Fitur baru
						</div>
						<h3 id="invoice-iq" className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">
							<span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Invoice IQ</span> — Tanyai Invoice, Jawab Instan
						</h3>
						<p className="mt-2 text-slate-600">Ingin mendapatkan insight dari pembelian anda, atau ingin sekedar meminta rekomendasi dari barang yang telah anda pesan sebelumnya?</p>

						<ul className="mt-4 grid gap-2 text-sm text-slate-700">
							<Li>Chatbot AI membaca detail pemesanan yang sudah anda beli</Li>
							<Li>Bisa ditanya ulang soal item, harga, atau tanggal pesanan</Li>
							<Li>Minta rekomendasi barang dari pemesanan anda sebelumnya</Li>
						</ul>

						<div className="mt-6 flex flex-wrap items-center gap-3">
							<Button asChild className="focus-visible:ring-2 focus-visible:ring-purple-600">
								<Link href="/dashboard/orders">Coba Invoice IQ</Link>
							</Button>
						</div>
					</div>

					{/* Mock preview */}
					<Card className="w-full max-w-md bg-gradient-to-br from-indigo-50 to-purple-50 border-slate-200/80">
						<CardContent className="p-4">
							<div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-700 shadow-sm">
								<div className="mb-2 flex items-center justify-between">
									<span className="font-semibold">INV-2309</span>
									<span className="rounded bg-slate-100 px-2 py-0.5">Tersimpan</span>
								</div>
								<div className="rounded-lg border bg-slate-50 p-3">
									<p className="font-medium">AI Insight</p>
									<p className="mt-1 text-slate-600">
										Total: <strong>Rp 1.950.000</strong>. Item terbesar: <strong>Headphone Pro</strong> (Rp 1.500.000). Metode: <strong>QRIS</strong>.
									</p>
								</div>
								<div className="mt-3 flex justify-end text-sm font-medium">
									Tanya AI <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
