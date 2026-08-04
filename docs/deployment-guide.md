# 🚀 Panduan Deployment Ivet Mart (Khusus Klien Non-Teknis)

Dokumen ini berisi panduan langkah demi langkah untuk melakukan deployment dan menjalankan Ivet Mart Marketplace pada server baru.

---

## 📋 Prasyarat Server
1. **Sistem Operasi**: Linux (Ubuntu 22.04 / 24.04 LTS direkomendasikan).
2. **Perangkat Lunak Terinstal**:
   - **Docker** (`docker --version`)
   - **Docker Compose** (`docker compose version`)

---

## ⚡ Langkah Quick Start (1 Perintah)

### 1. Salin Repositori & File Konfigurasi
```bash
git clone https://github.com/brianwibowo/ivetmart.git
cd ivetmart
```

### 2. Buat File Konfigurasi Lingkungan (`.env.production`)
Salin file template yang sudah disediakan:
```bash
cp .env.production.example .env.production
```
Buka `.env.production` dengan editor teks (misal `nano .env.production`) dan sesuaikan variabel kunci:
- `POSTGRES_PASSWORD`: Password database PostgreSQL.
- `DATABASE_URL`: Ganti password di URL sesuai password di atas.
- `BETTER_AUTH_SECRET`: Ganti dengan 32 karakter acak (dapat dibuat dengan perintah: `openssl rand -base64 32`).
- `BETTER_AUTH_URL`: Domain resmi server klien (contoh: `https://marketplace.kampus.ac.id`).
- `NEXT_PUBLIC_URL`: Samakan dengan `BETTER_AUTH_URL`.

### 3. Jalankan Aplikasi
```bash
docker compose up -d
```

Selesai! Aplikasi Ivet Mart sekarang berjalan secara otomatis:
- **Web Marketplace**: `http://localhost:8095` (atau dibantu Nginx/Domain Klien).
- **PostgreSQL Database**: Otomatis tersimpan persisten di volume `ivetmart_pgdata`.

---

## 📦 Pemeliharaan & Backup Otomatis

### Menjalankan Backup Database Manual
```bash
bash scripts/backup-db.sh
```
File backup `.sql.gz` akan tersimpan rapi di folder `./backups/` dengan nama timestamp.

### Menjadwalkan Backup Otomatis Setiap Malam (Cron Job)
Buka crontab server:
```bash
crontab -e
```
Tambahkan baris berikut untuk backup otomatis pukul 02:00 pagi setiap hari:
```cron
0 2 * * * /path/ke/ivetmart/scripts/backup-db.sh > /dev/null 2>&1
```

---

## 🛠️ Troubleshooting Sederhana

| Kendala | Penyebab | Solusi |
|:---|:---|:---|
| Halaman tidak terbuka | Container belum siap | Cek status dengan: `docker compose ps` |
| Database Error | Password di `.env.production` tidak cocok | Pastikan `POSTGRES_PASSWORD` & `DATABASE_URL` menggunakan password yang sama persis |
| Lihat Catatan Log Server | Memantau aktivitas server | Jalankan: `docker compose logs -f web` |
| Restart Server | Server restart mati listrik | Docker otomatis menyalakan container kembali (`restart: always`) |
