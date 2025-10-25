// Utility function to create SEO-friendly slug from product name
export function createSlug(nama) {
	if (!nama) return '';
	return nama
		.toLowerCase()
		.replace(/[^\w\s-]/g, '') // Remove special characters
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/--+/g, '-') // Replace multiple - with single -
		.trim();
}

// Utility function to convert slug back to query-friendly format
export function slugToQuery(slug) {
	return slug.replace(/-/g, ' ');
}
