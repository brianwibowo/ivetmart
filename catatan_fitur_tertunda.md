# 📋 Catatan Fitur Tertunda — Ivet Mart

> Catatan ini berisi fitur-fitur yang **belum dikerjakan** dan perlu didiskusikan dengan klien terlebih dahulu.
> Hapus/pindahkan item ke implementation plan saat sudah siap dikerjakan.

---

## 1. 💰 Komisi / Fee Platform

**Status:** ⏳ Belum diputuskan

**Pertanyaan untuk klien:**
- Apakah ada potongan komisi per transaksi dari platform ke penjual?
- Berapa persentase (%) atau flat fee?
- Apakah komisi berbeda per kategori produk?
- Apakah ada sistem penarikan dana (withdrawal) untuk penjual?

**Catatan teknis:**
- Perlu tabel `platform_fees` atau kolom `commission_rate` di `seller_stores`
- Perlu tabel `seller_balances` dan `withdrawal_requests`
- Logika pemotongan di saat order `completed`

---

## 2. 💳 Payment Gateway

**Status:** ⏳ Belum diintegrasikan

**Dummy sementara (HAPUS SAAT KETEMU KLIEN):**
```
Bank: BCA
No. Rekening: 0961166321
Keterangan: Dummy transfer manual — untuk development/testing saja
```

**Opsi gateway Indonesia:**
| Gateway | Kelebihan |
|---|---|
| **Midtrans** | Paling populer, QRIS, VA, e-wallet, CC |
| **Xendit** | API bagus, invoice system, disbursement |
| **Doku** | Bank lokal lengkap |
| **Tripay** | Murah, cocok untuk UMKM |

**Pertanyaan untuk klien:**
- Gateway mana yang dipilih?
- Apakah perlu fitur transfer manual (konfirmasi admin)?
- Apakah perlu QRIS, virtual account, e-wallet, atau semua?

**Catatan teknis:**
- Sementara pakai flow "transfer manual + konfirmasi admin"
- Tabel `payments` sudah disiapkan di skema
- Integrasi gateway tinggal plug-in ke checkout flow nanti

---

## 3. 🚚 Integrasi Ongkir / Pengiriman

**Status:** ⏳ Belum diputuskan

**Opsi API ongkir:**
| API | Kelebihan |
|---|---|
| **RajaOngkir** | Gratis (starter), JNE/TIKI/Pos |
| **Shipper** | Multi-kurir, tracking, pickup |
| **Biteship** | API modern, banyak kurir |

**Pertanyaan untuk klien:**
- Apakah perlu cek ongkir otomatis atau input manual?
- Kurir apa saja yang didukung?
- Apakah ada opsi "gratis ongkir" untuk promo?

**Catatan teknis:**
- Sementara pakai input manual oleh penjual (flat rate / gratis)
- Kolom `shipping_cost` dan `shipping_method` sudah ada di skema `order_sellers`
- Integrasi API ongkir tinggal ditambahkan nanti

---

> **Terakhir diupdate:** 29 Juli 2026
