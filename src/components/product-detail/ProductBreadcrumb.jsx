import Link from 'next/link';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function ProductBreadcrumb({ productName }) {
	return (
		<header className="w-full border-b border-violet-100 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto h-14 px-4 sm:px-6 lg:px-8 flex items-center">
				<Breadcrumb className="w-full">
					<BreadcrumbList className="flex items-center gap-1">
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/" className="text-sm text-violet-600 hover:text-violet-800 transition-colors">
									Beranda
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="mx-2 text-violet-200">/</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/products" className="text-sm text-violet-600 hover:text-violet-800 transition-colors">
									Produk
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="mx-2 text-violet-200">/</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbPage className="truncate max-w-[50vw] text-sm text-violet-900 font-medium">{productName}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	);
}
