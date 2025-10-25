import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProductToolbar({ search, setSearch, category, setCategory, sortBy, setSortBy, categories }) {
	return (
		<div className="hidden md:flex items-center gap-4 mb-8">
			<div className="flex-1 relative group">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-violet-400 group-focus-within:text-violet-600 transition-colors" />
				<Input
					type="text"
					placeholder="Cari produk..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="pl-10 h-11 border-violet-200 bg-white hover:border-violet-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 placeholder:text-violet-300 transition-all"
				/>
			</div>
			<Select value={category} onValueChange={setCategory}>
				<SelectTrigger className="w-[180px] h-11 border-violet-200 bg-white hover:border-violet-300 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all">
					<SelectValue placeholder="Kategori" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all" className="focus:bg-violet-50 focus:text-violet-900">
						Semua Kategori
					</SelectItem>
					{categories.map((cat) => (
						<SelectItem key={cat} value={cat} className="capitalize focus:bg-violet-50 focus:text-violet-900">
							{cat}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select value={sortBy} onValueChange={setSortBy}>
				<SelectTrigger className="w-[180px] h-11 border-violet-200 bg-white hover:border-violet-300 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all">
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
	);
}
