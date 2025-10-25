import { Badge } from '@/components/ui/badge';
import Step from '@/components/site/landing/Step';

export default function FlowSection() {
	return (
		<section aria-labelledby="flow-title" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<div className="mx-auto max-w-4xl text-center">
				<Badge variant="secondary" className="mb-2">
					ALUR
				</Badge>
				<h2 id="flow-title" className="text-3xl md:text-4xl font-bold tracking-tight">
					Cara kerja yang simpel ✨
				</h2>
			</div>

			<div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
				<Step num="01" title="Temukan & Pilih" desc="Cari produk dengan mudah, gunakan filter atau sort, lalu lihat detail spesifikasinya." />
				<Step num="02" title="Chat & Bandingkan" desc="Tanya AI untuk rekomendasi, atau bandingkan dua produk secara instan." />
				<Step num="03" title="Checkout" desc="Selesaikan pesanan dengan proses yang cepat dan aman." />
				<Step num="04" title="Invoice IQ" desc="Dapatkan insight cerdas dari riwayat pembelianmu." />
			</div>
		</section>
	);
}
