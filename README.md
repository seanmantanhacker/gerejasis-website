# SIS (Sooyoungro Indonesia Service) Busan Website

Official website for **Sooyoungro Indonesia Service (SIS)** — Indonesian Christian church community and fellowship affiliated with Sooyoungro Presbyterian Church (대한예수교장로회 수영로교회) in Busan, South Korea.

---

## 🌟 Key Features

- **Branded Design & Header**: Official church emblem, motto (*"Our Church, Your Home"*), and bilingual identification (*Gereja Indonesia di Busan*).
- **Hero Photo Slideshow**: Rotating congregation photo slideshow (auto-advance, prev/next & dot navigation) with theme scripture (*Mazmur 119:105*) — 9 real photos from Sunday services, church gatherings, Christmas, birthdays, and retreats.
- **Live Sunday Countdown**: Real-time interactive countdown timer calculating the time remaining until next Sunday's 12:00 PM KST service, with a live "sedang berlangsung" state during the service.
- **Weekly Fellowship & Worship Schedule**:
  - Sunday Service: 12:00 – 14:00 KST (Lantai 2 Vision Center)
  - Komsel Daerah Kyungsung: setiap Rabu, 19:00 – 21:00 KST
  - Komsel Daerah Busan University (Online): setiap Kamis, 21:00 KST
  - Bible Study: setiap Sabtu, 18:00 – 21:00 KST
  - Sports Day: setiap Sabtu, 10:00 – 12:00 KST
  - Scripture Inspiration: 1 Timotius 1:12
- **Online Service Hub**: Referral card to the official YouTube live stream & channel for Sunday sermons.
- **Community Activities**: Highlights for university students, workers, retreats, and newcomers in Busan, plus an **Upcoming Activities** template section (currently empty, ready for Retreat/Natal/Hangout announcements).
- **Location & South Korea Navigation**:
  - Subway directions: **Bexco Station (벡스코역), Exit 1**, walk straight 80m.
  - Building photo guide with **Lantai 2 (2nd Floor)** callout.
  - **1-Click "Salin Alamat"**: Copies Korean address (`부산광역시 해운대구 해운대로 402 수영로교회 비전센터 2층`) with toast notification.
  - **Direct Map Buttons**: Naver Map (네이버 지도), KakaoMap (카카오맵), and Google Maps.
  - **Kontak Resmi**: Email, Instagram, TikTok, YouTube, Facebook, and WhatsApp — using standard Font Awesome brand icons.
- **Multi-language Support (ID / EN / KR)**: Nearly all visible text on the page is translatable via a `data-i18n` system; Indonesian is the source-of-truth default. Chosen language persists across visits (`localStorage`).
- **Mobile Optimized**: Responsive layout with a sticky floating quick-action bar for mobile devices.

---

## 🚀 Cara Deploy ke GitHub Pages (How to Deploy)

Website ini dibuat menggunakan arsitektur **Pure Static Frontend (HTML5, CSS3, Vanilla JavaScript)** tanpa dependensi npm/build, sehingga dapat langsung di-hosting di GitHub Pages secara gratis.

### Langkah-langkah:
1. **Commit & Push ke GitHub**:
   ```bash
   git add .
   git commit -m "Build complete SIS church website for Busan"
   git push origin main
   ```
2. **Buka Pengaturan Repository di GitHub**:
   - Masuk ke tab **Settings** di repository GitHub Anda (`gerejasis-website`).
   - Di menu sebelah kiri, klik **Pages** (di bawah bagian *Code and automation*).
3. **Pilih Sumber Build & Deploy**:
   - Di bagian **Build and deployment** > **Source**, pilih **Deploy from a branch**.
   - Di bawah **Branch**, pilih `main` (atau `master`) dan folder `/ (root)`.
   - Klik tombol **Save**.
4. **Selesai**:
   - Tunggu sekitar 1–2 menit hingga GitHub Pages selesai memproses.
   - Website Anda akan aktif di URL:
     `https://<username-github-anda>.github.io/gerejasis-website/`
   - (Opsional) Tambahkan custom domain lewat kolom **Custom domain** di halaman Pages yang sama.

---

## 📁 Struktur File

```
gerejasis-website/
├── index.html              # Halaman utama (Single-page app dengan smooth scrolling)
├── 404.html                # Halaman fallback 404 untuk GitHub Pages
├── assets/
│   ├── css/
│   │   └── style.css       # Design system, glassmorphism, responsive styles
│   ├── js/
│   │   └── main.js         # Countdown timer, hero slideshow, copy address, language switcher, particles
│   └── images/
│       ├── logo.png              # Logo resmi gereja Sooyoungro (dipakai di header, favicon, footer)
│       ├── hero-congregation.jpg # Foto jemaat SIS (slide 1 hero slideshow)
│       ├── building-exterior.jpg # Foto gedung Vision Center lantai 2 (section Find Us)
│       ├── follow-badge.png      # Aset cadangan, belum dipakai di halaman
│       ├── logo-emblem.png       # Aset cadangan, belum dipakai di halaman
│       ├── logo-transparent.png  # Aset cadangan, belum dipakai di halaman
│       ├── map-preview.png       # Aset cadangan, belum dipakai di halaman
│       ├── video-thumb-1.png     # Aset cadangan, belum dipakai di halaman
│       ├── video-thumb-2.png     # Aset cadangan, belum dipakai di halaman
│       └── home/                 # Foto slide 2–9 hero slideshow (sudah dikompres, EXIF di-strip)
│           ├── sunday-service-hall.jpg
│           ├── christmas-natal-2025.jpg
│           ├── year-end-gathering.jpg
│           ├── community-gathering.jpg
│           ├── birthday-celebration.jpg
│           ├── outdoor-retreat.jpg
│           ├── autumn-picnic.jpg
│           └── fellowship-table.jpg
└── README.md
```

> Foto di `assets/images/home/` sudah diproses: rotasi EXIF dikoreksi, ukuran diperkecil ke maksimum 1600px pada sisi terpanjang, dan metadata EXIF (termasuk data lokasi GPS ponsel) dihapus sebelum dipublikasikan. Untuk menambah/mengganti foto slideshow, cukup taruh file baru di folder ini lalu tambahkan/ubah blok `<div class="hero-slide">...</div>` yang sesuai di `index.html`.

> Ikon sosial media (Instagram, TikTok, YouTube, Facebook, WhatsApp) memakai **Font Awesome** via CDN (`cdnjs.cloudflare.com`), bukan file gambar lokal.

---

## 🌐 Multi-language (i18n)

Semua teks yang ditandai atribut `data-i18n` / `data-i18n-html` diterjemahkan lewat kamus `translations` di `assets/js/main.js` (key `id`, `en`, `kr`). Bahasa Indonesia adalah versi acuan (source of truth) — setiap penambahan teks baru di `index.html` harus:
1. Ditulis dalam Bahasa Indonesia langsung di HTML dengan atribut `data-i18n="namaKey"`.
2. Ditambahkan key yang sama persis ke ketiga blok bahasa (`id`, `en`, `kr`) di `translations`.

---

## 🔐 Halaman Khusus Admin (`/admin` / `admin.html`)

Untuk mengupdate poster Ibadah Raya Minggu dan tema khotbah setiap pekan secara **real-time tanpa perlu melakukan git commit**:
1. Buka halaman `https://<domain-website>/admin.html` (atau `/admin`).
2. Masukkan password admin (default: `sisbusan2026`).
3. Masukkan link postingan Instagram terbaru (misal: `https://www.instagram.com/p/DclUqbjE42Y/`).
4. Klik **"Ambil Info"** atau sesuaikan Tema Khotbah, Pembicara, dan Jadwal pada formulir.
5. Periksa tampilan pada **Live Preview**.
6. Klik tombol **"Simpan & Tampilkan di Website Langsung"**.
7. Data langsung tersimpan di Cloud JSON API dan website utama (`index.html`) seketika menampilkan poster dan warta terbaru.

---

## ⛪ Kontak & Informasi Gereja

- **Alamat**: 수영로교회 비전센터 2층, 부산광역시 해운대구 해운대로 402
- **Email**: infogerejasis@gmail.com
- **Instagram**: [@Gerejasis_official](https://instagram.com/Gerejasis_official)
- **TikTok**: [@Gerejasis_official](https://www.tiktok.com/@gerejasis_official)
- **YouTube**: [Sis Indonesia](https://www.youtube.com/@sisindonesia1611)
- **Facebook**: Sooyoungro Indonesian Service
- **WhatsApp**: [010-5796-0961](https://wa.me/821057960961)
