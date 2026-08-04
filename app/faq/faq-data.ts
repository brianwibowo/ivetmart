export type FAQCategory = {
	id: string;
	title: string;
	questions: { question: string; answer: string }[];
};

export const faqCategories: FAQCategory[] = [
	{
		id: "pemesanan",
		title: "Pemesanan & Belanja",
		questions: [
			{
				question: "Bagaimana cara membuat pesanan di Ivet Mart?",
				answer:
					"Jelajahi produk di katalog, pilih varian yang diinginkan, lalu klik 'Tambah ke Keranjang'. Setelah selesai memilih, buka Keranjang Belanja dan klik 'Lanjut ke Pembayaran'. Isi alamat pengiriman dan pilih metode pembayaran.",
			},
			{
				question: "Apakah saya harus membuat akun sebelum belanja?",
				answer:
					"Tidak wajib! Pembeli dapat menjelajahi produk dan memasukkan barang ke keranjang belanja sebagai Pembeli Tamu (Guest). Namun, jika Anda masuk (login), riwayat pesanan dan alamat pengiriman Anda akan tersimpan dengan rapi.",
			},
			{
				question: "Berapa lama proses verifikasi pesanan?",
				answer:
					"Pesanan yang dibayar via Transfer Bank BCA akan terverifikasi secara otomatis atau oleh tim admin dalam kurun waktu 1–3 jam kerja. Anda dapat memantau status pesanan di halaman Riwayat Pesanan.",
			},
			{
				question: "Bisakah saya mengubah alamat pengiriman setelah order dibuat?",
				answer:
					"Jika status pesanan masih 'Dibuat' (Pending), Anda dapat menghubungi penjual atau admin untuk memperbarui alamat pengiriman sebelum barang dikirim.",
			},
		],
	},
	{
		id: "pembayaran",
		title: "Pembayaran & Metode",
		questions: [
			{
				question: "Metode pembayaran apa saja yang tersedia?",
				answer:
					"Kami mendukung pembayaran via Transfer Bank BCA Resmi Ivet Mart (No. Rekening: 0961166321 A.N Ivet Mart Marketplace) serta QRIS & E-Wallet untuk transaksi praktis.",
			},
			{
				question: "Apakah transaksi di Ivet Mart aman?",
				answer:
					"Sangat aman. Setiap transaksi dibungkus dengan enkripsi HTTPS standar industri dan sistem autentikasi terverifikasi. Kami tidak pernah menyimpan data rahasia kartu Anda di server.",
			},
			{
				question: "Bagaimana jika pembayaran saya gagal atau pending?",
				answer:
					"Pastikan Anda telah menyalin nomor rekening BCA dengan benar dan mentransfer nominal yang tepat. Jika ada kendala, hubungi tim bantuan Ivet Mart dengan melampirkan bukti transfer.",
			},
		],
	},
	{
		id: "pengiriman",
		title: "Pengiriman & Resi",
		questions: [
			{
				question: "Berapa biaya pengiriman produk?",
				answer:
					"Untuk promo khusus civitas akademika UNISVET & wilayah Semarang, pengiriman mendapatkan promo Gratis Ongkir atau tarif flat terjangkau yang dihitung otomatis saat checkout.",
			},
			{
				question: "Bagaimana cara melacak resi pengiriman?",
				answer:
					"Setelah penjual mengirimkan barang dan memasukkan nomor resi, Anda dapat melihat nomor resi dan indikator status visual (Dibuat ➔ Dikonfirmasi ➔ Dalam Pengiriman ➔ Selesai) di halaman Riwayat Belanja.",
			},
			{
				question: "Apa yang harus dilakukan jika barang rusak saat diterima?",
				answer:
					"Jangan khawatir. Harap foto atau videokan kondisi paket saat dibongkar (unboxing) lalu hubungi tim penjual atau admin Ivet Mart untuk proses penggantian produk baru.",
			},
		],
	},
	{
		id: "penjual",
		title: "Pendaftaran Toko (Penjual)",
		questions: [
			{
				question: "Bagaimana cara buka toko di Ivet Mart?",
				answer:
					"Klik menu 'Semua Toko' atau 'Buka Toko', lalu isi formulir pendaftaran toko (nama toko, deskripsi, alamat, dan nomor HP). Setelah mendaftar, tim Admin Ivet Mart akan memverifikasi toko Anda dalam 1x24 jam.",
			},
			{
				question: "Apakah ada biaya pendaftaran toko?",
				answer:
					"Pendaftaran toko di Ivet Mart 100% GRATIS untuk seluruh civitas akademika UNISVET, alumni, dan pelaku UMKM Semarang.",
			},
			{
				question: "Bagaimana cara menambah produk baru di toko saya?",
				answer:
					"Masuk ke Dashboard Penjual (/seller/products), klik 'Tambah Produk Baru', isi nama, harga, stok, dan unggah foto produk. Fitur preview gambar live akan menampilkan pratinjau produk Anda secara instant.",
			},
		],
	},
];
