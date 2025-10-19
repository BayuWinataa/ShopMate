// app/(admin)/layout.jsx
import Link from 'next/link';

export default function AdminLayout({ children }) {
	return (
		<div className="min-h-screen bg-gray-50 flex">
			{/* Sidebar */}
			<aside className="w-64 hidden md:flex flex-col border-r bg-white">
				<div className="h-16 flex items-center px-4 border-b">
					<Link href="/" className="text-lg font-bold text-indigo-600">
						MyShop Admin
					</Link>
				</div>

				<nav className="flex-1 p-3 space-y-1">
					<Link href="/admin" className="block px-3 py-2 rounded-lg hover:bg-indigo-50 text-gray-700">
						Dashboard
					</Link>
					<Link href="/admin/products" className="block px-3 py-2 rounded-lg hover:bg-indigo-50 text-gray-700">
						Produk
					</Link>
					<Link href="/admin/orders" className="block px-3 py-2 rounded-lg hover:bg-indigo-50 text-gray-700">
						Pesanan
					</Link>
					<Link href="/admin/customers" className="block px-3 py-2 rounded-lg hover:bg-indigo-50 text-gray-700">
						Pelanggan
					</Link>
					<Link href="/admin/settings" className="block px-3 py-2 rounded-lg hover:bg-indigo-50 text-gray-700">
						Pengaturan
					</Link>
				</nav>

				<div className="p-3 border-t">
					<Link href="/" className="block w-full text-center px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
						Kembali ke Toko
					</Link>
				</div>
			</aside>

			{/* Main */}
			<div className="flex-1 flex flex-col">
				{/* Topbar */}
				<header className="h-16 bg-white border-b flex items-center justify-between px-4">
					<div className="flex items-center gap-2">
						<button
							type="button"
							className="md:hidden inline-flex items-center px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
							// TODO: tambahkan drawer sidebar versi mobile kalau butuh
						>
							☰
						</button>
						<h1 className="font-semibold text-gray-900">Panel Admin</h1>
					</div>

					<div className="flex items-center gap-3">
						<span className="hidden sm:inline text-sm text-gray-500">admin@myshop.com</span>
						<button className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Logout</button>
					</div>
				</header>

				{/* Content */}
				<main className="p-4 md:p-6">{children}</main>
			</div>
		</div>
	);
}
