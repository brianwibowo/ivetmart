# 📡 Panduan Monitoring & Pemantauan Uptime Ivet Mart

Dokumen ini menjelaskan cara menyiapkan pemantauan gratis 24/7 agar pengelola server/klien mendapatkan notifikasi otomatis jika server mengalami gangguan.

---

## 🔍 Endpoint Health Check Sistem

Aplikasi Ivet Mart dilengkapi dengan endpoint monitoring bawaan:
- **URL**: `https://DOMAIN_KLIEN.id/api/health`
- **Metode**: `GET`
- **Output Respons Healthy (Status 200 OK)**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-08-05T04:30:00.000Z",
    "database": "connected",
    "dbLatencyMs": 3,
    "version": "0.1.0"
  }
  ```

---

## 🛠️ Langkah Setting Monitoring Gratis (UptimeRobot)

1. **Daftar Akun Gratis**: Buka [UptimeRobot.com](https://uptimerobot.com) dan buat akun gratis.
2. **Tambah Monitor Baru**:
   - **Monitor Type**: `HTTP(s)`
   - **Friendly Name**: `Ivet Mart Production`
   - **URL (or IP)**: `https://DOMAIN_KLIEN.id/api/health`
   - **Monitoring Interval**: `5 minutes`
3. **Konfigurasi Notifikasi Alert**:
   - Masukkan alamat Email tim teknis / WhatsApp / Telegram.
   - Apabila server mengalami gangguan, UptimeRobot akan mengirim notifikasi langsung dalam kurun waktu 5 menit.
