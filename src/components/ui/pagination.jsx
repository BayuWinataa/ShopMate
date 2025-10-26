'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

function Pagination({ className, ...props }) {
	return <nav role="navigation" aria-label="pagination" className={cn('mx-auto flex w-full justify-center', className)} {...props} />;
}

function PaginationContent({ className, ...props }) {
	return <ul className={cn('flex flex-row items-center gap-1', className)} {...props} />;
}

function PaginationItem({ className, ...props }) {
	return <li className={cn('list-none', className)} {...props} />;
}

function PaginationLink({ className, isActive, href = '#', prefetch, ...props }) {
	// Active page uses a violet "pressed" look, other pages use outline
	return <Link href={href} prefetch={prefetch} aria-current={isActive ? 'page' : undefined} className={cn(buttonVariants({ variant: isActive ? 'pressViolet' : 'outline', size: 'sm' }), 'h-9 w-9 p-0', className)} {...props} />;
}

function PaginationPrevious({ className, href = '#', prefetch, ...props }) {
	return (
		<Link href={href} prefetch={prefetch} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1 pl-2.5 pr-2.5 border-violet-700 text-violet-700 hover:bg-violet-50', className)} {...props}>
			<span className="sr-only">Sebelumnya</span>
			<span aria-hidden>«</span>
		</Link>
	);
}

function PaginationNext({ className, href = '#', prefetch, ...props }) {
	return (
		<Link href={href} prefetch={prefetch} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1 pl-2.5 pr-2.5 border-violet-700 text-violet-700 hover:bg-violet-50', className)} {...props}>
			<span className="sr-only">Berikutnya</span>
			<span aria-hidden>»</span>
		</Link>
	);
}

function PaginationEllipsis({ className, ...props }) {
	return (
		<span className={cn('flex h-9 w-9 items-center justify-center rounded-md border border-violet-100 bg-violet-50 text-sm text-violet-600', className)} {...props}>
			…<span className="sr-only">Lebih banyak halaman</span>
		</span>
	);
}

export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis };
