import { z } from 'zod';

// Register schema and validator
export const registerSchema = z.object({
	email: z.string({ required_error: 'Email wajib diisi' }).trim().min(1, 'Email wajib diisi').email('Email tidak valid'),
	password: z.string({ required_error: 'Password wajib diisi' }).min(6, 'Password minimal 6 karakter').max(72, 'Password maksimal 72 karakter'),
});

/**
 * Validate register form data using Zod
 * @param {{ email: string; password: string }} data
 * @returns {{ success: true; data: { email: string; password: string } } | { success: false; fieldErrors: { email: string; password: string }; formError: string }}
 */
export function validateRegister(data) {
	const result = registerSchema.safeParse(data);
	if (!result.success) {
		const f = result.error.flatten();
		return {
			success: false,
			fieldErrors: {
				email: f.fieldErrors.email?.[0] || '',
				password: f.fieldErrors.password?.[0] || '',
			},
			formError: '',
		};
	}
	return { success: true, data: result.data };
}

// Login schema and validator
export const loginSchema = z.object({
	email: z.string({ required_error: 'Email wajib diisi' }).trim().min(1, 'Email wajib diisi').email('Email tidak valid'),
	password: z.string({ required_error: 'Password wajib diisi' }).min(1, 'Password wajib diisi').min(6, 'Password minimal 6 karakter'),
});

/**
 * Validate login form data using Zod
 * @param {{ email: string; password: string }} data
 * @returns {{ success: true; data: { email: string; password: string } } | { success: false; fieldErrors: { email: string; password: string }; formError: string }}
 */
export function validateLogin(data) {
	const result = loginSchema.safeParse(data);
	if (!result.success) {
		const f = result.error.flatten();
		return {
			success: false,
			fieldErrors: {
				email: f.fieldErrors.email?.[0] || '',
				password: f.fieldErrors.password?.[0] || '',
			},
			formError: '',
		};
	}
	return { success: true, data: result.data };
}
