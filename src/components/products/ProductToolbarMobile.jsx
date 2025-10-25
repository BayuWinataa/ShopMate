import { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function ProductToolbarMobile({ search, setSearch, category, setCategory, sortBy, setSortBy, categories }) {
	const [open, setOpen] = useState(false);

	return (
		<div className="md:hidden mb-6">
			<div className="relative mb-3 group">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-violet-400 group-focus-within:text-violet-600 transition-colors" />
				<Input
					type="text"
					placeholder="Cari produk..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="pl-10 border-violet-600 bg-white hover:border-violet-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 placeholder:text-violet-300 transition-all"
				/>
			</div>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button variant="outline" className="w-full border-violet-200 bg-white text-violet-700 hover:bg-violet-50 hover:text-violet-900 hover:border-violet-300 transition-all">
						<Filter className="mr-2 h-4 w-4" />
						Filter & Urutkan
					</Button>
				</SheetTrigger>
				<SheetContent side="bottom" className="h-[80vh]">
					<SheetHeader className="border-b border-violet-200 pb-4 mb-4">
						<SheetTitle className="text-violet-900">Filter Produk</SheetTitle>
					</SheetHeader>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium mb-2 block text-violet-900">Kategori</label>
							<Select value={category} onValueChange={setCategory}>
								<SelectTrigger className="border-violet-200 bg-white hover:border-violet-300 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all">
									<SelectValue placeholder="Kategori" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all" className="capitalize focus:bg-violet-50 focus:text-violet-900">
										Semua Kategori
									</SelectItem>
									{categories.map((cat) => (
										<SelectItem key={cat} value={cat} className="capitalize focus:bg-violet-50 focus:text-violet-900">
											{cat}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<label className="text-sm font-medium mb-2 block text-violet-900">Urutkan</label>
							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="border-violet-200 bg-white hover:border-violet-300 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all">
									<SelectValue placeholder="Urutkan" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="name-asc" className="focus:bg-violet-50 focus:text-violet-900">
										Nama: A-Z
									</SelectItem>
									<SelectItem value="name-desc" className="focus:bg-violet-50 focus:text-violet-900">
										Nama: Z-A
									</SelectItem>
									<SelectItem value="price-asc" className="focus:bg-violet-50 focus:text-violet-900">
										Harga: Terendah
									</SelectItem>
									<SelectItem value="price-desc" className="focus:bg-violet-50 focus:text-violet-900">
										Harga: Tertinggi
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="absolute bottom-6 left-6 right-6">
						<Button variant="pressPurple" onClick={() => setOpen(false)} className="w-full">
							Terapkan Filter
						</Button>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
}
