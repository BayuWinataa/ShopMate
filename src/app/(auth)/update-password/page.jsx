import UpdatePasswordForm from './update-password-form';

// Server Component: render form untuk update password
// Code exchange sudah ditangani oleh /auth/callback route
export default async function UpdatePasswordPage() {
	// Render form - client-side component akan handle session validation
	return <UpdatePasswordForm />;
}
