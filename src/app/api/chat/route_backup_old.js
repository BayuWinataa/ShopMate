// File: app/api/chat/route.js
import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Initialize Groq client only when needed
let groq;
const initGroq = () => {
	if (!groq) {
		const apiKey = process.env.GROQ_API_KEY;
		if (!apiKey) {
			throw new Error('GROQ_API_KEY environment variable is missing');
		}
		groq = new Groq({ apiKey });
	}
	return groq;
};

// Cache for products to avoid repeated database calls
let productsCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to fetch products from Supabase with caching
const getProducts = async () => {
	const now = Date.now();
	
	// Return cached products if still valid
	if (productsCache && (now - lastFetchTime) < CACHE_DURATION) {
		return productsCache;
	}

	try {
		const { data, error } = await supabase
			.from('Products')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching products from Supabase:', error);
			return productsCache || []; // Return cached data or empty array
		}

		productsCache = data || [];
		lastFetchTime = now;
		return productsCache;
	} catch (err) {
		console.error('Network error fetching products:', err);
		return productsCache || []; // Return cached data or empty array
	}
};

// Utils
const escapeRegExp = (s) => String(s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\\\$&');

const normalizeName = (s) =>
	String(s || '')
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[''`"]/g, '')
		.replace(/[\\s\\-_.]+/g, ' ')
		.trim();

// Extract product IDs from text
const extractIdsFromText = (text) => {
	if (typeof text !== 'string') return [];
	const matches = Array.from(text.matchAll(/\\[ID:(\\d+)\\]/g));
	return matches.map((m) => parseInt(m[1], 10)).filter((n) => Number.isFinite(n));
};

// Remove internal ID markers from text
const stripInternalIds = (text) => {
	if (typeof text !== 'string') return String(text || '');
	return text.replace(/\\[ID:\\d+\\]/g, '').trim();
};

// Inject ID markers based on product names
const injectIdsIfMissing = (text, catalog) => {
	if (!text || !Array.isArray(catalog)) return text;
	
	let result = text;
	const seen = new Set();

	catalog.forEach(({ id, nama }) => {
		if (!nama || seen.has(id)) return;
		
		const escaped = escapeRegExp(nama);
		const regex = new RegExp(`\\\\b${escaped}\\\\b`, 'gi');
		
		if (regex.test(result) && !result.includes(`[ID:${id}]`)) {
			result = result.replace(regex, `${nama}[ID:${id}]`);
			seen.add(id);
		}
	});

	return result;
};

// Fallback extraction
const fallbackExtractIds = (text, catalog) => {
	if (!text || !Array.isArray(catalog)) return [];
	
	const found = [];
	const normalized = normalizeName(text);

	catalog.forEach(({ id, nama }) => {
		if (!nama) return;
		const normalizedName = normalizeName(nama);
		if (normalizedName && normalized.includes(normalizedName)) {
			found.push(id);
		}
	});

	return found;
};

// Deduplicate while keeping order
const dedupeKeepOrder = (arr) => {
	const seen = new Set();
	return arr.filter((x) => (seen.has(x) ? false : (seen.add(x), true)));
};

export async function POST(req) {
	try {
		// Initialize Groq client at runtime
		const groqClient = initGroq();

		const { messages, context } = await req.json();

		// Fetch products from Supabase
		const products = await getProducts();

		// Sanitize dan batasi pesan dari client
		const clientMessages = Array.isArray(messages)
			? messages
					.map((m) => ({
						role: m?.role,
						content: typeof m?.content === 'string' ? m.content : String(m?.content ?? ''),
					}))
					.filter((m) => m.role === 'user' || m.role === 'assistant')
					.slice(-4) // Hanya 4 pesan terakhir untuk menghemat token
			: [];

		// Potong catalog produk jika terlalu besar (maksimal 30 produk untuk model kecil)
		const limitedProducts = products.slice(0, 30);

		// Ringkas katalog yang disuapkan ke model (hanya field penting)
		const productInfo = JSON.stringify(
			limitedProducts.map((p) => ({
				id: p.id,
				nama: p.nama,
				harga: p.harga,
				kategori: p.kategori,
				deskripsi: p.deskripsi ? p.deskripsi.slice(0, 50) : '', // Batasi deskripsi sangat ketat
			}))
		);

		// System message yang sangat ringkas
		const systemMessage = {
			role: 'system',
			content: `Anda ShopMate AI. Bantu user pilih produk dari katalog:
${productInfo}

${context ? `KONTEKS: ${context.slice(0, 150)}` : ''}

ATURAN: Rekomendasikan 3-5 produk terbaik dari katalog. Format: **Nama** — **Rp X** — fitur. Jangan tampilkan ID. Bahasa Indonesia santai.`
		};

		// Panggil Groq dengan fallback model
		let chatCompletion;
		try {
			chatCompletion = await groqClient.chat.completions.create({
				messages: [systemMessage, ...clientMessages],
				model: 'llama3-8b-8192', // Model yang lebih kecil dan efisien
				temperature: 0.7,
				max_tokens: 512, // Kurangi max tokens
			});
		} catch (error) {
			// Jika masih error, coba dengan model yang lebih kecil
			if (error.message.includes('413') || error.message.includes('rate_limit_exceeded')) {
				console.log('Token limit exceeded, trying with smaller model...');
				chatCompletion = await groqClient.chat.completions.create({
					messages: [systemMessage, ...clientMessages],
					model: 'gemma-7b-it', // Model alternatif yang lebih kecil
					temperature: 0.7,
					max_tokens: 256, // Token lebih sedikit lagi
				});
			} else {
				throw error;
			}
		}

		const aiResponse = chatCompletion.choices?.[0]?.message?.content || '';

		// 1) Bersihkan ID yang mungkin ditulis model
		const cleanedOnce = stripInternalIds(aiResponse);

		// 2) Injeksi [ID:x] HANYA untuk ekstraksi internal berbasis nama
		const catalog = limitedProducts.map((p) => ({ id: p.id, nama: p.nama }));
		const augmented = injectIdsIfMissing(cleanedOnce, catalog);

		// 3) Ekstrak semua ID dari augmented
		let ids = extractIdsFromText(augmented);

		// 4) Fallback: union dengan hasil pencarian longgar
		const loose = fallbackExtractIds(cleanedOnce, catalog);
		ids = dedupeKeepOrder([...ids, ...loose]);

		// 5) Teks balasan ke user TANPA ID
		const reply = stripInternalIds(augmented);

		// 6) Kirim reply + daftar ids
		return NextResponse.json({ reply, ids });
	} catch (error) {
		console.error('Error calling Groq API:', error);
		return NextResponse.json({ 
			error: `Groq API Error: ${error.message}`,
			reply: 'Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi dengan pertanyaan yang lebih sederhana.'
		}, { status: 500 });
	}
}