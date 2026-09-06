# SIS (Sooyoungro Indonesia Service) Busan Website

Official website for **Sooyoungro Indonesia Service (SIS)** — Indonesian Christian church community and fellowship affiliated with Sooyoungro Presbyterian Church (대한예수교장로회 수영로교회) in Busan, South Korea.

---

## 🌟 Key Features

- **Branded Design & Header**: Official church emblem, motto (*"Our Church, Your Home"*), and bilingual identification (*Gereja Indonesia di Busan*).
- **Hero Showcase**: High-resolution congregation photo with theme scripture (*Mazmur 119:105*).
- **Live Sunday Countdown**: Real-time interactive countdown timer calculating the time remaining until next Sunday's 12:00 PM KST service.
- **Weekly Fellowship & Worship Schedule**:
  - Sunday Service: 12:00 – 14:00 KST (Lantai 2 Vision Center)
  - Tuesday Fellowship: 20:00 – 22:00 KST
  - Wednesday Fellowship: 19:00 – 21:00 KST
  - Thursday Fellowship: 21:00 – 22:00 KST
  - Friday Bible Study: 19:00 – 21:00 KST
  - Saturday Fellowship: 19:00 – 21:00 KST
  - Scripture Inspiration: 1 Timotius 1:12
- **Online Service & Media Hub**: Sunday sermon recordings, alumni testimonies, and fellowship moments.
- **Community Activities**: Highlights for university students, workers, retreats, and newcomers in Busan.
- **Location & South Korea Navigation**:
  - Subway directions: **Bexco Station (벡스코역 / Line 2 & Donghae Line), Exit 1**, walk straight 80m.
  - Building photo guide with **Lantai 2 (2nd Floor)** callout.
  - **1-Click "Salin Alamat"**: Copies Korean address (`부산광역시 해운대구 해운대로 402 수영로교회 비전센터 2층`) with toast notification.
  - **Direct Map Buttons**: Naver Map (네이버 지도), KakaoMap (카카오맵), and Google Maps.
- **Multi-language Support**: Switch between Indonesian (ID), English (EN), and Korean (KR).
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
   - Tunggu sekitar 1–2 menit hingga GitHub Actions selesai memproses.
   - Website Anda akan aktif di URL:
     `https://<username-github-anda>.github.io/gerejasis-website/`

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
│   │   └── main.js         # Countdown timer, copy address, language switcher, particles
│   └── images/
│       ├── logo.png        # Logo resmi gereja Suwon/Sooyoungro
│       ├── hero-congregation.png # Foto jemaat SIS
│       ├── building-exterior.png # Foto gedung Vision Center lantai 2
│       ├── video-thumb-1.png     # Thumbnail video testimoni
│       └── video-thumb-2.png     # Thumbnail video fellowship
└── README.md
```

---

## ⛪ Kontak & Informasi Gereja

- **Alamat**: 수영로교회 비전센터 2층, 부산광역시 해운대구 해운대로 402
- **Email**: infogerejasis@gmail.com
- **Instagram**: [@Gerejasis_official](https://instagram.com/Gerejasis_official)
- **Facebook**: Sooyoungro Indonesian Service
