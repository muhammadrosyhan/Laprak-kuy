# PraktiNote — Personal Practicum Report Builder

Aplikasi Next.js untuk menyusun laporan praktikum pribadi menggunakan template laporan: cover, pre-test, alat/bahan, langkah kerja, implementasi screenshot + penjelasan, analisis, post-test.

## Menjalankan di laptop

1. Install Node.js versi 20 atau lebih baru.
2. Buka terminal di folder `PraktiNote`.
3. Jalankan `npm install`.
4. Jalankan `npm run dev`.
5. Buka `http://localhost:3000` di browser.

## Fitur saat ini

- Dashboard laporan, pencarian, filter status.
- Form cover dan identitas tersimpan.
- Editor langkah praktikum (tambah, hapus, ubah urutan).
- Upload beberapa screenshot per praktikum, paste dari clipboard saat fokus di area upload.
- Caption dan penjelasan yang tetap terkait setiap praktikum.
- Preview A4 dan export PDF lewat fungsi Print browser (pilih Save as PDF).
- Data tersimpan otomatis di `localStorage` browser.
- Backup/restore seluruh data ke file JSON.

## Batasan yang perlu diketahui

- Belum memakai Supabase atau database online. Data tersimpan **hanya di browser/perangkat yang sama**. Jangan bersihkan data browser tanpa membuat backup JSON.
- `localStorage` memiliki kuota terbatas. Gambar besar dapat memenuhi kuota. Saat ini maksimal 4 MB per file, tetapi kuota keseluruhan browser sering lebih kecil. Gunakan screenshot yang dikompresi.
- Export Word belum tersedia.
- Hasil PDF menggunakan dialog cetak browser; pilih ukuran A4, margin none/default sesuai preview, dan matikan header/footer browser jika muncul.
- Sampul logo universitas masih placeholder opsional.
- Nomor gambar mengikuti nomor pertemuan, bukan nomor bab; format ini bisa disesuaikan nantinya.

## Struktur proyek

- `app/page.tsx`: dashboard, editor, preview, manajemen data.
- `app/globals.css`: komponen visual, responsive, gaya cetak A4.
- `lib/types.ts`: model data laporan dan contoh format.

## Tahap berikutnya

Supabase Auth (satu akun), PostgreSQL, Storage untuk screenshot, export DOCX, preview pagination lebih akurat, serta template tambahan per mata kuliah.


## Update v1.1 — Template menyesuaikan PDF contoh
- Ukuran dokumen **US Letter** (216 × 279,4 mm), sesuai PDF sumber; **bukan A4**.
- Margin isi sekitar: kiri 38,1 mm, kanan 25,4 mm, atas/bawah 25,4 mm.
- Huruf isi 11 pt, line-height 15,5 pt; heading utama 14 pt, subheading 12 pt, sampul 14 pt.
- Cover diposisikan mengikuti lokasi teks dalam PDF. Sumber tidak memperlihatkan logo pada cover, maka placeholder logo dihilangkan.
- Kolom penjelasan Post Test kini terpisah dan muncul di bawah screenshot.
- Untuk cetak pilih Paper = Letter, Margins = None, Scale = 100%, Headers/Footers = Off, Save as PDF.
- Font asli pada PDF tercatat sebagai CIDFont; Times New Roman adalah pendekatan visual, **bukan bukti font yang sama persis**.
- Penempatan tiap screenshot pada halaman yang identik belum dijamin, karena tergantung ukuran dan jumlah gambar yang diunggah.
