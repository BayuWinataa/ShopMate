import { Skeleton } from '@/components/ui/skeleton';

export default function ProductCardSkeleton() {
	return (
		<div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
			{/* Image Skeleton */}
			<Skeleton className="relative aspect-square w-full bg-gradient-to-br from-violet-50 to-purple-50" />

			{/* Content */}
			<div className="p-5 space-y-3">
				{/* Category Badge Skeleton */}
				<Skeleton className="h-6 w-24 rounded-full bg-violet-100" />

				{/* Name Skeleton */}
				<div className="space-y-2">
					<Skeleton className="h-5 w-full bg-gray-200" />
					<Skeleton className="h-5 w-3/4 bg-gray-200" />
				</div>

				{/* Price Skeleton */}
				<Skeleton className="h-8 w-32 bg-gradient-to-r from-violet-100 to-purple-100" />
			</div>
		</div>
	);
}
