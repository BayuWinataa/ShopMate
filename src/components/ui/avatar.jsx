import * as React from 'react';
import { cn } from '@/lib/utils';

const Avatar = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)} {...props} />);
Avatar.displayName = 'Avatar';

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => <img ref={ref} className={cn('aspect-square h-full w-full', className)} {...props} />);
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted', className)} {...props} />);
AvatarFallback.displayName = 'AvatarFallback';

const EmailAvatar = React.forwardRef(({ email, size = 'default', className, ...props }, ref) => {
	const sizeClasses = {
		sm: 'h-8 w-8 text-sm',
		default: 'h-7 w-7 text-base',
		lg: 'h-12 w-12 text-lg',
		xl: 'h-16 w-16 text-xl',
	};

	const getInitial = (email) => {
		if (!email || typeof email !== 'string') return '?';
		return email.charAt(0).toUpperCase();
	};

	const getBackgroundColor = (email) => {
		if (!email) return 'bg-muted';

		// Generate a consistent color based on the first character
		const char = email.charAt(0).toLowerCase();
		const colors = ['bg-violet-500'];

		const index = char.charCodeAt(0) % colors.length;
		return colors[index];
	};

	return (
		<Avatar ref={ref} className={cn(sizeClasses[size], className)} {...props}>
			<AvatarFallback className={cn('text-white font-semibold', getBackgroundColor(email))}>{getInitial(email)}</AvatarFallback>
		</Avatar>
	);
});
EmailAvatar.displayName = 'EmailAvatar';

export { Avatar, AvatarImage, AvatarFallback, EmailAvatar };
