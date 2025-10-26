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
	if (productsCache && now - lastFetchTime < CACHE_DURATION) {
		return productsCache;
	}

	try {
		const { data, error } = await supabase.from('Products').select('*').order('created_at', { ascending: false });

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

/* =========================
   Utils (robust & reusable)
   ========================= */

// Escape untuk dipakai di RegExp
const escapeRegExp = (s) => String(s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Normalisasi ringan untuk perbandingan nama (hilangkan spasi dobel, tanda baca umum)
const normalizeName = (s) =>
	String(s || '')
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[’'`"]/g, '') // apostrophe/quotes
		.replace(/[\(\)\[\]\{\}]/g, ' ') // bracket jadi spasi
		.replace(/[.,;:/\\|!?~\-–—_+*=<>@#%^&]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

/** Hapus pola ID dari teks model (defense-in-depth) */
function stripInternalIds(text) {
	if (!text) return text;
	let out = text;

	// [ID:13], (ID: 13), {ID#13}
	out = out.replace(/\s*[\[\(\{]\s*ID\s*[:#]?\s*\d+\s*[\]\)\}]/gi, '');
	// ID:13 / ID#13 / ID 13
	out = out.replace(/(?<=^|[\s,.;\-—–])ID\s*[:#]?\s*\d+\b/gi, '');
	// Rapikan spasi
	out = out.replace(/[ \t]{2,}/g, ' ').replace(/\s+(\r?\n)/g, '$1');

	return out;
}

function injectIdsIfMissing(text, catalog) {
	if (!text) return text;

	const parts = text.split(/```/); // segmen genap = di luar fence
	for (let i = 0; i < parts.length; i += 2) {
		let chunk = parts[i];

		for (const p of catalog) {
			const escaped = escapeRegExp(p.nama);
			if (!escaped) continue;

			// (^|non-letter/number) [**|__]? (NamaProduk) [**|__]? (?=end|non-letter/number) dan tidak diikuti [ID:...]
			const nameRe = new RegExp(`(^|[^\\p{L}\\p{N}])(?:\\*\\*|__)?(${escaped})(?:\\*\\*|__)?(?=($|[^\\p{L}\\p{N}]))(?![^\\[]*\\[ID:)`, 'giu');

			// Pertahankan pembatas + core (dengan markdown) lalu sisipkan [ID:x]
			chunk = chunk.replace(nameRe, (m, left, core) => `${left}${core} [ID:${p.id}]`);
		}
		parts[i] = chunk;
	}
	return parts.join('```');
}

/** Ekstrak semua ID dari teks (format [ID:123]) */
const extractIdsFromText = (t) =>
	Array.from(String(t || '').matchAll(/\[ID:(\d+)\]/g))
		.map((m) => parseInt(m[1], 10))
		.filter(Number.isFinite);

/**
 * Fallback: cari nama produk yang disebut di teks (longgar),
 * pakai normalisasi ringan & pembatas non-alfanumerik.
 */
function fallbackExtractIds(text, catalog) {
	const txt = normalizeName(text);
	const ids = [];

	for (const p of catalog) {
		const nameNorm = normalizeName(p.nama);
		if (!nameNorm) continue;

		// Pastikan cocok sebagai token (pembatas non-alfanumerik)
		const re = new RegExp(`(^|[^a-z0-9])${escapeRegExp(nameNorm)}($|[^a-z0-9])`, 'i');
		if (re.test(txt)) ids.push(p.id);
	}
	return ids;
}

/** Dedupe sambil mempertahankan urutan kemunculan */
function dedupeKeepOrder(arr) {
	const seen = new Set();
	const out = [];
	for (const x of arr) {
		if (!seen.has(x)) {
			seen.add(x);
			out.push(x);
		}
	}
	return out;
}

/* =========================
   Route Handler
   ========================= */

// Force dynamic rendering to avoid build-time evaluation
export const dynamic = 'force-dynamic';

export async function POST(req) {
	try {
		// Initialize Groq client at runtime
		const groqClient = initGroq();

		const { messages, context } = await req.json();

		// Fetch products from Supabase
		const products = await getProducts();

		// Sanitize pesan dari client (buang field liar spt meta)
		const clientMessages = Array.isArray(messages)
			? messages
					.map((m) => ({
						role: m?.role,
						content: typeof m?.content === 'string' ? m.content : String(m?.content ?? ''),
					}))
					.filter((m) => m.role === 'user' || m.role === 'assistant')
			: [];

		// Ringkas katalog yang disuapkan ke model
		const productInfo = JSON.stringify(
			products.map((p) => ({
				id: p.id,
				nama: p.nama,
				harga: p.harga,
				kategori: p.kategori,
				deskripsi: p.deskripsi,
				longDeskripsi: p.longDeskripsi || p.deskripsi,
				tags: p.tags,
			}))
		);

		const systemMessage = {
			role: 'system',
			content: `Anda adalah **"ShopMate AI"**, asisten belanja yang ramah, cepat, dan akurat.
Tugas Anda: membantu pengguna menemukan produk terbaik **hanya dari katalog JSON** yang disediakan.
KATALOG (JSON):
${productInfo}

${context ? `KONTEKS TAMBAHAN:\n${context}\n` : ''}

/* =========================
   PRINSIP UTAMA (ANTI-HALU)
   ========================= */
- **Sumber tunggal**: Semua rekomendasi WAJIB berasal dari katalog JSON di atas. Dilarang menyebut produk di luar katalog.
- **Transparansi**: Jika tidak ada produk yang cocok, katakan terus terang dan berikan alternatif relevan dari katalog (kategori/fitur terdekat).
- **Kecepatan memahami niat**: Baca maksud pengguna (kado, olahraga, kerja, gaming, budget, brand favorit, dsb.) dari konteks yang ada.
- Jangan tampilkan ID produk di balasan.

/* =======================
   KEBIJAKAN ID (WAJIB)
   ======================= */
- ID produk bersifat internal untuk tautan/lookup saja.
- DILARANG menampilkan pola apa pun yang mengandung ID ke user, termasuk:
  [ID:12], (ID: 12), ID#12, #12, atau variasi sejenis.
- Jika nama produk di data sudah mengandung ID di teks, HAPUS pola ID tersebut sebelum menulis ke output.
- Jika user meminta ID, jawab sopan bahwa “ID hanya untuk keperluan sistem”.

/* =======================
   GAYA & PENGALAMAN (UX)
   ======================= */
- Bahasa Indonesia santai, sopan, ringkas; seperti teman yang ahli belanja.
- Jangan tampilkan id dari produk (misal [ID:23]) di balasan ke user.
- Tanyakan **maksimal 2 pertanyaan singkat** hanya jika benar-benar diperlukan untuk memperjelas (misal: budget atau preferensi kunci).
  - Jika user belum menjawab, **lanjutkan dengan asumsi wajar** (jelaskan asumsi), lalu berikan rekomendasi awal.
- Hindari paragraf panjang. Gunakan heading singkat, poin, dan tabel ringkas saat bermanfaat.
- Hindari spam emoji; gunakan seperlunya (maks 1 di judul/heading bila cocok).

/* ======================
   STRATEGI REKOMENDASI
   ====================== */
- Saat merekomendasikan:
  1) **Pilih 3–5 produk** paling relevan (prioritas: kecocokan kebutuhan → harga → ketersediaan fitur → ulasan internal bila ada).
  2) Sertakan **nama produk** persis, **perkiraan harga (format IDR)**, **fitur kunci**, dan **alasan singkat**.
  3) Jangan tampilkan ID produk di balasan.

- Jika pengguna menyebut target penerima (mis. “untuk ayah”), preferensikan fitur relevan (kenyamanan, kemudahan pakai, ketahanan).

/* ======================
   ATURAN FORMAT BALASAN
   ====================== */
- **Markdown wajib**.
- Struktur default:
  - **Ringkas**: 1–2 kalimat inti (apa yang terbaik untuk kasus user).
  - Jangan tampilkan ID produk di balasan .
  - **Rekomendasi**: daftar berpoin 3–5 item. Tiap item: Nama — harga — 2–3 poin keunggulan.
  - **Banding Singkat** (opsional)
  - **Kenapa Ini Cocok**: 2–4 poin alasan terhubung dengan niat user.
- Saat menampilkan harga, gunakan format Rupiah Indonesia (contoh: **Rp 1.500.000**).
- Jika produk memiliki field \`gambar\`, tautkan namanya ke halaman detail internal (jangan render gambar inline kecuali diminta).
- Jangan tampilkan ID produk di balasan.	

/* ======================
   PERILAKU SAAT TIDAK COCOK
   ====================== */
- Jika tidak ada yang cocok: tulis “Belum menemukan yang pas.” lalu
  - Tawarkan 3 alternatif terdekat di katalog (jelaskan kompromi).
  - Tanyakan 1–2 klarifikasi paling ber-impact (mis. “budget maksimum?”).

/* ======================
   BATASAN & ETIKA
   ====================== */
- Dilarang: info medis, hukum, atau di luar konteks belanja (arahkan kembali dengan sopan).
- Dilarang meminta unggahan gambar/PDF. Jika user menyebut invoice, gunakan teks/kode/informasi yang diberikan.
- Jangan menebak spesifikasi yang tidak ada di JSON. Jika tidak tercantum, katakan “tidak tersedia di data”.

/* ======================
   CONTOH OUTPUT (RINGKAS)
   ====================== */
- **Ringkas**  
  Headphone untuk kerja fokus dengan noise-cancelling dan nyaman dipakai lama.
- **Rekomendasi**
  • **Headphone Peredam Bising Pro** — **Rp 1.500.000**  
    Keunggulan: ANC efektif, suara jernih, bantalan empuk.
  • **Nama Produk 2** — **Rp X**  
    Keunggulan: …  
  • **Nama Produk 3** — **Rp X**  
    Keunggulan: …
- **Banding Singkat**  
- **Kenapa Ini Cocok**
  - Bisa meredam bising kantor/kafe.
  - Nyaman untuk pemakaian >2 jam.
  - Sesuai budget menengah.
`,
		};

		// Panggil Groq
		const chatCompletion = await groqClient.chat.completions.create({
			messages: [systemMessage, ...clientMessages],
			model: 'meta-llama/llama-4-scout-17b-16e-instruct',
			temperature: 0.7,
			max_tokens: 1024,
		});

		const aiResponse = chatCompletion.choices?.[0]?.message?.content || '';

		// 1) Bersihkan ID yang mungkin ditulis model (defense-in-depth)
		const cleanedOnce = stripInternalIds(aiResponse);

		// 2) Injeksi [ID:x] HANYA untuk ekstraksi internal berbasis nama
		const catalog = products.map((p) => ({ id: p.id, nama: p.nama }));
		const augmented = injectIdsIfMissing(cleanedOnce, catalog);

		// 3) Ekstrak semua ID dari augmented (primer)
		let ids = extractIdsFromText(augmented);

		// 4) Fallback: union dengan hasil pencarian longgar (agar SEMUA yang disebut ikut)
		if (true) {
			const loose = fallbackExtractIds(cleanedOnce, catalog);
			ids = dedupeKeepOrder([...ids, ...loose]);
		}

		// 5) Teks balasan ke user TANPA ID
		const reply = stripInternalIds(augmented);

		// 6) Kirim reply + daftar ids
		return NextResponse.json({ reply, ids });
	} catch (error) {
		console.error('Error calling Groq API:', error);
		return NextResponse.json({ error: `Groq API Error: ${error.message}` }, { status: 500 });
	}
}
