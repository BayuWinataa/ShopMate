# Google OAuth Setup Guide

## Konfigurasi Google OAuth di Supabase

### 1. Setup Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih existing project
3. Buka **APIs & Services > Credentials**
4. Klik **Create Credentials > OAuth 2.0 Client IDs**
5. Pilih **Web application**
6. Tambahkan **Authorized redirect URIs**:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
7. Simpan **Client ID** dan **Client Secret**

### 2. Konfigurasi Supabase Dashboard

1. Buka Supabase Dashboard
2. Masuk ke **Authentication > Providers**
3. Cari **Google** dan klik **Enable**
4. Masukkan:
   - **Client ID**: dari Google Cloud Console
   - **Client Secret**: dari Google Cloud Console
5. Klik **Save**

### 3. Environment Variables

Pastikan environment variables berikut sudah diset:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Fitur yang Ditambahkan

### Komponen Baru

- `GoogleLoginButton`: Tombol login dengan Google OAuth
- Enhanced auth callback handling
- Improved error handling untuk OAuth

### Halaman yang Diupdate

- **Login Page**: Ditambahkan tombol Google login
- **Register Page**: Ditambahkan tombol Google signup
- **Dashboard**: Menampilkan info user dari Google (avatar, nama)
- **Auth Callback**: Menangani OAuth flow dengan lebih baik

### Error Handling

- OAuth error handling
- Callback failure handling
- Network error handling

## Testing

1. Pastikan konfigurasi Google OAuth sudah benar
2. Test login dengan Google di halaman `/login`
3. Periksa dashboard untuk melihat info user Google
4. Test logout functionality

## Troubleshooting

### Error: "redirect_uri_mismatch"

Ini terjadi ketika redirect URI tidak sesuai dengan yang terdaftar di Google Cloud Console.

**Solusi:**

1. **Periksa port aplikasi**: Pastikan aplikasi berjalan di port yang sama dengan yang terdaftar di Google Cloud Console
2. **Update Google Cloud Console**: Tambahkan redirect URI untuk semua port yang mungkin digunakan:
   ```
   http://localhost:3000/auth/v1/callback
   http://localhost:3001/auth/v1/callback
   https://your-project.vercel.app/auth/v1/callback
   ```
3. **Force port tertentu**: Gunakan `--port 3000` saat menjalankan development server:
   ```bash
   npx next dev --port 3000
   ```

### Error: "Invalid redirect URI"

- Pastikan redirect URI di Google Cloud Console sesuai dengan Supabase URL
- Format yang benar: `https://your-project.supabase.co/auth/v1/callback`

### Error: "OAuth Error"

- Periksa Client ID dan Client Secret di Supabase Dashboard
- Pastikan Google Provider sudah enabled di Supabase

### User tidak redirect ke dashboard

- Periksa console browser untuk error
- Pastikan middleware berjalan dengan benar
- Periksa auth callback route logs

### Port sudah digunakan

Jika mendapat error "port already in use":

```bash
# Windows - cari proses yang menggunakan port
netstat -ano | findstr :3000

# Hentikan proses (ganti PID dengan nomor yang ditemukan)
taskkill /F /PID [PID_NUMBER]

# Atau gunakan port lain
npx next dev --port 3001
```

**Catatan**: Jika menggunakan port selain 3000, pastikan untuk menambahkan redirect URI yang sesuai di Google Cloud Console.
