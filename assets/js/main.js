/**
 * SIS (Sooyoungro Indonesia Service) - Main Interactive Logic
 * Features:
 * - Live Sunday Service Countdown (KST / Busan Time)
 * - Copy Korean Address to Clipboard with Toast Notification
 * - Interactive Video Switcher
 * - Multi-language Content Switcher (ID, EN, KR)
 * - Mobile Navigation Menu
 * - Ambient Starlight / Floating Dust Particle Canvas
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initLanguageSwitcher();
  initCountdown();
  initCopyAddress();
  initNavScroll();
  initVideoPlayer();
  initHeroSlideshow();
  initLiveWeeklyPoster();
});

/* Currently active language ('id' | 'en' | 'kr'), persisted across visits */
let currentLang = 'id';
try {
  currentLang = localStorage.getItem('sisLang') || 'id';
} catch (e) {
  currentLang = 'id';
}

function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || translations.id[key] || '';
}

/* ==========================================================
   1. Live Sunday Service Countdown (Busan KST: UTC+9)
   ========================================================== */
function initCountdown() {
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-mins');
  const secsEl = document.getElementById('timer-secs');
  const subtitleEl = document.getElementById('countdown-subtitle');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function updateTimer() {
    // Current time in UTC
    const now = new Date();
    
    // Convert to KST (UTC + 9)
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const kstTime = new Date(utcTime + (3600000 * 9));

    // Target: Next Sunday at 12:00:00 KST
    const target = new Date(kstTime);
    const dayOfWeek = kstTime.getDay(); // 0 is Sunday
    let daysUntilSunday = (7 - dayOfWeek) % 7;

    // Set target to this Sunday at 12:00 PM KST
    target.setDate(kstTime.getDate() + daysUntilSunday);
    target.setHours(12, 0, 0, 0);

    // If today is Sunday and it's already past 14:00 KST (service finished), target next Sunday
    if (dayOfWeek === 0 && kstTime.getHours() >= 14) {
      target.setDate(target.getDate() + 7);
    }

    const diff = target.getTime() - kstTime.getTime();

    // If currently between Sunday 12:00 and 14:00 KST
    if (dayOfWeek === 0 && kstTime.getHours() >= 12 && kstTime.getHours() < 14) {
      if (subtitleEl) subtitleEl.textContent = t('countdownLive');
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================
   2. Copy Korean Address to Clipboard with Toast Notification
   ========================================================== */
function initCopyAddress() {
  const copyBtns = document.querySelectorAll('.copy-address-btn');
  const toast = document.getElementById('toast');

  const koreanAddress = "부산광역시 해운대구 해운대로 402, 수영로교회 비전센터 2층";

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(koreanAddress).then(() => {
        showToast(t('toastCopied'));
      }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = koreanAddress;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(t('toastCopied'));
      });
    });
  });

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}

/* ==========================================================
   3. Smooth Scrolling, Mobile Menu, Active Nav Highlighting
   ========================================================== */
function initNavScroll() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Header scroll shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Active navigation indicator with IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================
   3b. Hero Photo Slideshow
   Slide pertama sudah punya src di HTML; sisanya memakai data-src dan baru
   di-fetch di sini (slide aktif + slide berikutnya) agar foto pertama muncul
   cepat saat halaman pertama kali dibuka.
   ========================================================== */
function initHeroSlideshow() {
  const slideshow = document.getElementById('hero-slideshow');
  if (!slideshow) return;

  const slides = slideshow.querySelectorAll('.hero-slide');
  const dots = slideshow.querySelectorAll('.slide-dot');
  const prevBtn = slideshow.querySelector('.slide-nav.prev');
  const nextBtn = slideshow.querySelector('.slide-nav.next');

  if (slides.length < 2) return;

  let current = 0;
  let timer = null;

  /* Pasang src sebenarnya dari data-src, sekali saja per slide */
  function loadSlide(index) {
    const img = slides[(index + slides.length) % slides.length].querySelector('img[data-src]');
    if (!img) return;
    img.src = img.getAttribute('data-src');
    img.removeAttribute('data-src');
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    loadSlide(current);
    loadSlide(current + 1);
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(next, 5000);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAutoplay(); });
  });

  slideshow.addEventListener('mouseenter', stopAutoplay);
  slideshow.addEventListener('mouseleave', startAutoplay);

  /* Baru siapkan slide ke-2 setelah foto pertama selesai, supaya tidak rebutan bandwidth */
  const firstImg = slides[0].querySelector('img');
  if (!firstImg || firstImg.complete) {
    loadSlide(1);
  } else {
    firstImg.addEventListener('load', () => loadSlide(1), { once: true });
    firstImg.addEventListener('error', () => loadSlide(1), { once: true });
  }

  startAutoplay();
}

/* ==========================================================
   4. Video Showcase / Sermon Switcher
   ========================================================== */
function initVideoPlayer() {
  const playlistItems = document.querySelectorAll('.playlist-card');
  const mainIframe = document.getElementById('main-sermon-iframe');
  const mainTitle = document.getElementById('main-video-title');
  const mainDesc = document.getElementById('main-video-desc');

  if (!playlistItems.length || !mainIframe) return;

  playlistItems.forEach(item => {
    item.addEventListener('click', () => {
      const videoSrc = item.getAttribute('data-video-src');
      const title = item.getAttribute('data-title');
      const desc = item.getAttribute('data-desc');

      if (videoSrc) mainIframe.src = videoSrc;
      if (mainTitle && title) mainTitle.textContent = title;
      if (mainDesc && desc) mainDesc.textContent = desc;

      // Scroll smoothly to video player if on mobile
      if (window.innerWidth < 768) {
        mainIframe.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
}

/* ==========================================================
   5. Multi-Language Switcher (ID, EN, KR)
   ========================================================== */
const translations = {
  id: {
    brandBadge: "Gereja Indonesia di Busan",
    navHome: "BERANDA",
    navVisit: "JADWAL IBADAH",
    navOnline: "IBADAH ONLINE",
    navActivities: "AKTIVITAS GEREJA",
    navFind: "LOKASI",
    heroPill: "Selamat Datang di Sooyoungro Indonesia Service",
    heroTitle: "Gereja Indonesia di Busan, Korea Selatan",
    heroVerse: "“Firman-Mu itu pelita bagi kakiku dan terang bagi jalanku.”",
    heroVerseCite: "— Mazmur 119:105",
    btnSchedule: "Jadwal Ibadah (Visit Us)",
    btnDirections: "Petunjuk Arah ke Gereja",
    btnOnline: "Ibadah Online (YouTube Live) ↗",
    countdownTitle: "Ibadah Raya Minggu Berikutnya",
    countdownSubtitle: "Setiap Minggu Pukul 12:00 - 14:00 KST (Waktu Korea)",
    countdownLive: "🔴 Sedang Berlangsung (Live Now!) - Bergabunglah bersama kami!",
    timerDays: "Hari",
    timerHours: "Jam",
    timerMins: "Menit",
    timerSecs: "Detik",
    posterBadge: "Tema Pekan Ini",
    posterTitle: "“Berbahagialah Orang Yang Dianiaya”",
    posterSpeaker: "Pembicara: Pdt. Misnan Nanang",
    posterSchedule: "Minggu, 13 September 2026, 12.00 PM KST",
    location: "Gedung Olympic Lt. 2 (Bexco Exit 1)",
    posterDesc: "Hadirilah kebaktian umum minggu ini bersama keluarga besar SIS di Busan. Pujian penyembahan, pemberitaan firman Tuhan, dan ramah tamah makan siang bersama.",
    posterBtn: "Buka Postingan Instagram ↗",
    posterClickHint: "Klik untuk membuka postingan di Instagram",
    sectionVisit: "JADWAL & IBADAH",
    visitTitle: "Jadwal Ibadah & Persekutuan",
    visitSubtitle: "Mari bergabung bertumbuh dalam iman dan firman Tuhan bersama saudara seiman di Busan.",
    schSundayTag: "Ibadah Utama",
    schSundayTitle: "Sunday Service",
    schSundayDesc: "Ibadah Raya Minggu berbahasa Indonesia. Pujian penyembahan, pemberitaan firman Tuhan, dan dilanjutkan dengan makan siang & ramah tamah bersama.",
    schKomselTag: "Komsel",
    schKyungsungTitle: "Komsel Daerah Kyungsung",
    schKyungsungTime: "Setiap Rabu, 19:00 – 21:00 KST",
    schKyungsungDesc: "Persekutuan komsel daerah Kyungsung, waktu sharing firman Tuhan serta doa syafaat bersama.",
    schKomselOnlineTag: "Komsel Online",
    schBusanOnlineTitle: "Komsel Daerah Busan University (Online)",
    schBusanOnlineTime: "Setiap Kamis, 21:00 KST",
    schBusanOnlineDesc: "Persekutuan komsel daerah Busan University yang diadakan secara online, saling menguatkan dan berbagi firman Tuhan.",
    schBibleTag: "Bible Study",
    schBibleTitle: "Bible Study",
    schBibleTime: "Setiap Sabtu, 18:00 – 21:00 KST",
    schBibleDesc: "Pendalaman Alkitab di gereja untuk memperlengkapi setiap jemaat memahami kebenaran firman secara mendalam.",
    schSportsTag: "Sports Day",
    schSportsTitle: "Sports Day",
    schSportsTime: "Setiap Sabtu, 10:00 – 12:00 KST",
    schSportsDesc: "Kebersamaan olahraga akhir pekan untuk menjaga kesehatan dan mempererat persaudaraan jemaat.",
    scriptureRef: "1 Timotius 1:12 (1 TIMOTHY 1:12)",
    scriptureText: "“Aku bersyukur kepada Dia, yang menguatkan aku, yaitu Kristus Yesus, Tuhan kita, karena Ia menganggap aku setia dan mempercayakan pelayanan ini kepadaku.”",
    sectionOnline: "IBADAH ONLINE",
    onlineTitle: "Ibadah Online & Live Streaming",
    onlineSubtitle: "Ikuti siaran langsung Ibadah Raya Minggu serta arsip khotbah firman Tuhan melalui kanal resmi YouTube SIS Indonesia.",
    youtubeBadge: "Live Streaming YouTube Resmi",
    youtubeDesc: "Ibadah Raya Minggu disiarkan secara langsung (Live Streaming) setiap hari Minggu pukul <strong>12:00 – 14:00 KST</strong> (Waktu Korea). Bagi jemaat, sahabat, dan keluarga yang berhalangan hadir di lokasi, Anda dapat bergabung dalam ibadah dan pujian secara daring.",
    btnOpenYoutube: "Buka YouTube Live Streams ↗",
    btnVisitChannel: "Kunjungi Halaman Channel",
    sectionActivities: "KEHIDUPAN GEREJA",
    activitiesTitle: "Aktivitas & Kehidupan Gereja",
    activitiesSubtitle: "Gereja SIS bukan sekadar tempat beribadah, melainkan rumah kedua bagi kita di perantauan.",
    actStudentsTitle: "Mahasiswa & Pelajar",
    actStudentsDesc: "Komunitas mahasiswa S1, S2, dan bahasa di berbagai universitas Busan (Pusan National Univ, Kyungsung, Pukyong, Tongmyong, dll).",
    actWorkersTitle: "Pekerja & Profesional",
    actWorkersDesc: "Dukungan rohani dan kekeluargaan erat bagi rekan-rekan pekerja migran Indonesia yang berkarya di kawasan Busan & Gyeongnam.",
    actRetreatTitle: "Retreat & Outing",
    actRetreatDesc: "Kegiatan rekreasi tahunan, retreat pembaharuan rohani, piknik musim semi, dan jelajah keindahan kota pelabuhan Busan.",
    actNewcomersTitle: "Welcoming Newcomers",
    actNewcomersDesc: "Baru pertama kali tiba di Busan? Kami siap menyambut Anda dengan hangat, membantu adaptasi dan kehidupan di Korea Selatan.",
    upcomingTitle: "Kegiatan Mendatang",
    upcomingEmpty: "Belum ada kegiatan mendatang saat ini. Nantikan info Retreat, Natal, Hangout, dan acara lainnya di sini.",
    sectionFind: "LOKASI KAMI",
    findTitle: "Lokasi & Petunjuk Arah",
    findSubtitle: "Gedung sangat mudah diakses dengan transportasi umum Subway Busan.",
    bexcoDir: "Bexco Station (벡스코역) Exit 1",
    bexcoDist: "Keluar dari Pintu 1, Jalan Lurus 80 Meter (1–2 menit jalan kaki)",
    addressLabelKorean: "Alamat Bahasa Korea (Untuk Navigasi / Taksi)",
    copyBtn: "Salin Alamat",
    openMapLabel: "Buka di Aplikasi Peta:",
    mapNaver: "Buka di Naver Map",
    mapKakao: "Buka di KakaoMap",
    mapGoogle: "Buka di Google Maps",
    contactLabel: "Kontak Resmi:",
    labelEmail: "Email:",
    labelInstagram: "Instagram:",
    labelTiktok: "TikTok:",
    labelYoutube: "YouTube:",
    labelFacebook: "Facebook:",
    labelWhatsapp: "WhatsApp:",
    floorBadge: "Lantai 2 (2nd Floor)",
    buildingCaption: "Pintu masuk utama gedung terlihat jelas setelah berjalan lurus 80m dari Exit 1 Stasiun Bexco. Naik ke Lantai 2 untuk ruangan ibadah SIS.",
    footerDesc: "Pelayanan ibadah dan persekutuan masyarakat Indonesia di Busan di bawah naungan Gereja Presbiterian Sooyoungro (대한예수교장로회 수영로교회).",
    footerNavTitle: "Navigasi",
    footerHome: "Beranda (Home)",
    footerVisit: "Jadwal Ibadah (Visit Us)",
    footerOnline: "Ibadah Online (Online Service) ↗",
    footerActivities: "Aktivitas Komunitas (Activities)",
    footerFind: "Lokasi & Arah (Find Us)",
    footerContactTitle: "Alamat & Kontak",
    footerBexco: "Bexco Station Exit 1 (Walk 80m)",
    footerCopyright: "© 2026 Sooyoungro Indonesia Service (SIS). Seluruh Hak Cipta Dilindungi. Berafiliasi dengan Gereja Presbiterian Sooyoungro, Busan, Korea Selatan.",
    floatLocation: "Lokasi",
    floatSchedule: "Jadwal",
    floatLive: "Live",
    toastDefault: "✓ Alamat berhasil disalin!",
    toastCopied: "✓ Alamat Korea berhasil disalin ke clipboard!"
  },
  en: {
    brandBadge: "Indonesian Church in Busan",
    navHome: "HOME",
    navVisit: "VISIT US",
    navOnline: "ONLINE SERVICE",
    navActivities: "CHURCH ACTIVITIES",
    navFind: "FIND US",
    heroPill: "Welcome to Sooyoungro Indonesia Service",
    heroTitle: "Indonesian Church in Busan, South Korea",
    heroVerse: "“Your word is a lamp to my feet and a light to my path.”",
    heroVerseCite: "— Psalm 119:105",
    btnSchedule: "Worship Schedule (Visit Us)",
    btnDirections: "Get Directions to the Church",
    btnOnline: "Online Service (YouTube Live) ↗",
    countdownTitle: "Next Sunday Worship Service",
    countdownSubtitle: "Every Sunday, 12:00 - 14:00 KST (Korea Time)",
    countdownLive: "🔴 Live Now! - Join us right now!",
    timerDays: "Days",
    timerHours: "Hours",
    timerMins: "Minutes",
    timerSecs: "Seconds",
    posterBadge: "This Week's Theme",
    posterTitle: "“Blessed Are the Pure in Heart”",
    posterSpeaker: "Speaker: Rev. Misnan Nanang",
    posterSchedule: "Every Sunday, 12:00 – 14:00 KST",
    posterLocation: "Vision Center 2nd Floor (Bexco Exit 1)",
    posterDesc: "Join our Sunday worship service with the SIS Busan family. Praise and worship, the preaching of the Word, and lunch fellowship together.",
    posterBtn: "Open Instagram Post ↗",
    posterClickHint: "Click to view full post on Instagram",
    sectionVisit: "SCHEDULE & WORSHIP",
    visitTitle: "Worship Schedule & Fellowship",
    visitSubtitle: "Join us and grow in faith and the Word of God together with fellow believers in Busan.",
    schSundayTag: "Main Service",
    schSundayTitle: "Sunday Service",
    schSundayDesc: "Sunday Worship Service in Indonesian. Praise and worship, preaching of the Word, followed by lunch and fellowship together.",
    schKomselTag: "Komsel (Cell Group)",
    schKyungsungTitle: "Kyungsung Area Cell Group",
    schKyungsungTime: "Every Wednesday, 19:00 – 21:00 KST",
    schKyungsungDesc: "Cell group fellowship for the Kyungsung area, with a time of sharing the Word of God and joint intercessory prayer.",
    schKomselOnlineTag: "Online Cell Group",
    schBusanOnlineTitle: "Busan University Area Cell Group (Online)",
    schBusanOnlineTime: "Every Thursday, 21:00 KST",
    schBusanOnlineDesc: "Cell group fellowship for the Busan University area held online, encouraging one another and sharing the Word of God.",
    schBibleTag: "Bible Study",
    schBibleTitle: "Bible Study",
    schBibleTime: "Every Saturday, 18:00 – 21:00 KST",
    schBibleDesc: "In-depth Bible study at the church to equip every member to understand the truth of God's Word more deeply.",
    schSportsTag: "Sports Day",
    schSportsTitle: "Sports Day",
    schSportsTime: "Every Saturday, 10:00 – 12:00 KST",
    schSportsDesc: "A weekend of sports together to stay healthy and strengthen the bond among the congregation.",
    scriptureRef: "1 Timothy 1:12",
    scriptureText: "“I thank Christ Jesus our Lord, who has given me strength, that he considered me trustworthy, appointing me to his service.”",
    sectionOnline: "ONLINE SERVICE",
    onlineTitle: "Online Service & Live Streaming",
    onlineSubtitle: "Follow the live broadcast of the Sunday Worship Service and past sermon archives through the official YouTube channel of SIS Indonesia.",
    youtubeBadge: "Official YouTube Live Stream",
    youtubeDesc: "The Sunday Worship Service is broadcast live every Sunday at <strong>12:00 – 14:00 KST</strong> (Korea Time). For members, friends, and family who are unable to attend in person, you are welcome to join the worship and praise online.",
    btnOpenYoutube: "Open YouTube Live Streams ↗",
    btnVisitChannel: "Visit Channel Page",
    sectionActivities: "COMMUNITY LIFE",
    activitiesTitle: "Church Activities & Community Life",
    activitiesSubtitle: "SIS Church is not just a place of worship, but a second home for us away from home.",
    actStudentsTitle: "Students & Scholars",
    actStudentsDesc: "A community of undergraduate, graduate, and language students at various universities in Busan (Pusan National Univ, Kyungsung, Pukyong, Tongmyong, etc).",
    actWorkersTitle: "Workers & Professionals",
    actWorkersDesc: "Spiritual support and close fellowship for Indonesian migrant workers serving in the Busan & Gyeongnam area.",
    actRetreatTitle: "Retreat & Outing",
    actRetreatDesc: "Annual recreational activities, spiritual renewal retreats, spring picnics, and exploring the beauty of the port city of Busan.",
    actNewcomersTitle: "Welcoming Newcomers",
    actNewcomersDesc: "New to Busan? We're ready to warmly welcome you and help with adapting to life in South Korea.",
    upcomingTitle: "Upcoming Activities",
    upcomingEmpty: "There are no upcoming activities at the moment. Stay tuned for updates on our Retreat, Christmas celebration, hangouts, and other events here.",
    sectionFind: "FIND US",
    findTitle: "Location & Directions",
    findSubtitle: "The building is very easy to reach using Busan's public subway.",
    bexcoDir: "Bexco Station (벡스코역) Exit 1",
    bexcoDist: "From Exit 1, walk straight for 80 meters (1–2 minutes on foot)",
    addressLabelKorean: "Korean Address (For Navigation / Taxi)",
    copyBtn: "Copy Address",
    openMapLabel: "Open in a Maps App:",
    mapNaver: "Open in Naver Map",
    mapKakao: "Open in KakaoMap",
    mapGoogle: "Open in Google Maps",
    contactLabel: "Official Contact:",
    labelEmail: "Email:",
    labelInstagram: "Instagram:",
    labelTiktok: "TikTok:",
    labelYoutube: "YouTube:",
    labelFacebook: "Facebook:",
    labelWhatsapp: "WhatsApp:",
    floorBadge: "2nd Floor",
    buildingCaption: "The main entrance is clearly visible after walking straight 80m from Bexco Station Exit 1. Head up to the 2nd floor for the SIS worship hall.",
    footerDesc: "Worship and fellowship services for the Indonesian community in Busan, under Sooyoungro Presbyterian Church (대한예수교장로회 수영로교회).",
    footerNavTitle: "Navigation",
    footerHome: "Home",
    footerVisit: "Worship Schedule (Visit Us)",
    footerOnline: "Online Service ↗",
    footerActivities: "Community Activities",
    footerFind: "Location & Directions (Find Us)",
    footerContactTitle: "Address & Contact",
    footerBexco: "Bexco Station Exit 1 (Walk 80m)",
    footerCopyright: "© 2026 Sooyoungro Indonesia Service (SIS). All Rights Reserved. Affiliated with Sooyoungro Presbyterian Church, Busan, South Korea.",
    floatLocation: "Location",
    floatSchedule: "Schedule",
    floatLive: "Live",
    toastDefault: "✓ Address copied successfully!",
    toastCopied: "✓ Korean address copied to clipboard!"
  },
  kr: {
    brandBadge: "부산 인도네시아 교회",
    navHome: "홈",
    navVisit: "예배 일정",
    navOnline: "온라인 예배",
    navActivities: "교회 활동",
    navFind: "오시는 길",
    heroPill: "수영로교회 인도네시아 예배 (SIS)에 오신 것을 환영합니다",
    heroTitle: "부산 인도네시아 교회 공동체",
    heroVerse: "“주의 말씀은 내 발에 등이요 내 길에 빛이니이다.”",
    heroVerseCite: "— 시편 119편 105절",
    btnSchedule: "예배 일정 (Visit Us)",
    btnDirections: "교회 오시는 길",
    btnOnline: "온라인 예배 (유튜브 라이브) ↗",
    countdownTitle: "다음 주일 대예배",
    countdownSubtitle: "매주 일요일 12:00 - 14:00 KST (한국시간)",
    countdownLive: "🔴 지금 예배가 진행 중입니다! - 함께 예배드려요!",
    timerDays: "일",
    timerHours: "시간",
    timerMins: "분",
    timerSecs: "초",
    posterBadge: "이번 주 말씀 주제",
    posterTitle: "“마음이 청결한 자의 복”",
    posterSpeaker: "설교: 미스난 나낭 목사",
    posterSchedule: "매주 일요일 12:00 – 14:00 KST",
    posterLocation: "비전센터 2층 (벡스코역 1번 출구)",
    posterDesc: "부산 SIS 공동체와 함께하는 주일 대예배에 참석해 보세요. 은혜로운 찬양과 말씀, 그리고 점심 애찬 교제가 함께합니다.",
    posterBtn: "인스타그램 게시물 보기 ↗",
    posterClickHint: "인스타그램에서 게시물 보기",
    sectionVisit: "예배 및 모임 안내",
    visitTitle: "예배 일정 및 모임 안내",
    visitSubtitle: "부산의 믿음의 지체들과 함께 신앙과 말씀 안에서 성장해 나가요.",
    schSundayTag: "주일 대예배",
    schSundayTitle: "주일예배",
    schSundayDesc: "인도네시아어로 진행되는 주일 대예배입니다. 찬양과 경배, 말씀 선포 후 함께 점심 식사와 교제의 시간을 갖습니다.",
    schKomselTag: "권설(구역모임)",
    schKyungsungTitle: "경성(Kyungsung) 지역 권설모임",
    schKyungsungTime: "매주 수요일, 19:00 – 21:00 KST",
    schKyungsungDesc: "경성 지역 권설모임으로 말씀 나눔과 중보기도의 시간을 함께합니다.",
    schKomselOnlineTag: "온라인 권설모임",
    schBusanOnlineTitle: "부산대학교 지역 권설모임 (온라인)",
    schBusanOnlineTime: "매주 목요일, 21:00 KST",
    schBusanOnlineDesc: "온라인으로 진행되는 부산대학교 지역 권설모임으로 서로 격려하고 말씀을 나눕니다.",
    schBibleTag: "성경공부",
    schBibleTitle: "성경공부",
    schBibleTime: "매주 토요일, 18:00 – 21:00 KST",
    schBibleDesc: "교회에서 진행되는 성경공부로, 모든 성도가 말씀의 진리를 깊이 이해하도록 돕습니다.",
    schSportsTag: "체육대회",
    schSportsTitle: "체육대회",
    schSportsTime: "매주 토요일, 10:00 – 12:00 KST",
    schSportsDesc: "주말 체육 활동을 통해 건강을 관리하고 성도 간의 교제를 더욱 돈독히 합니다.",
    scriptureRef: "디모데전서 1:12",
    scriptureText: "“나를 능하게 하신 그리스도 예수 우리 주께 내가 감사함은 나를 충성되이 여겨 내게 직분을 맡기심이니”",
    sectionOnline: "온라인 예배",
    onlineTitle: "온라인 예배 및 실시간 스트리밍",
    onlineSubtitle: "SIS 인도네시아 공식 유튜브 채널을 통해 주일 대예배 실시간 방송과 지난 설교를 시청하실 수 있습니다.",
    youtubeBadge: "공식 유튜브 라이브 스트림",
    youtubeDesc: "주일 대예배는 매주 일요일 <strong>한국시간(KST) 12:00 – 14:00</strong>에 실시간으로 생중계됩니다. 현장에 참석하기 어려운 성도님, 친구, 가족 여러분도 온라인으로 함께 예배와 찬양에 동참하실 수 있습니다.",
    btnOpenYoutube: "유튜브 라이브 스트림 열기 ↗",
    btnVisitChannel: "채널 페이지 방문하기",
    sectionActivities: "공동체 생활",
    activitiesTitle: "교회 활동 및 공동체 생활",
    activitiesSubtitle: "SIS 교회는 단순한 예배 장소가 아니라, 타지에서 생활하는 우리에게 제2의 집입니다.",
    actStudentsTitle: "유학생 및 학생",
    actStudentsDesc: "부산 내 여러 대학교(부산대학교, 경성대학교, 부경대학교, 동명대학교 등)에서 학사, 석사, 어학연수를 하는 학생 공동체입니다.",
    actWorkersTitle: "직장인 및 근로자",
    actWorkersDesc: "부산 및 경남 지역에서 일하는 인도네시아 이주 근로자들을 위한 영적 지원과 끈끈한 가족 같은 교제입니다.",
    actRetreatTitle: "수련회 및 야외활동",
    actRetreatDesc: "매년 진행되는 레크리에이션 활동, 영적 재충전을 위한 수련회, 봄 소풍, 아름다운 항구도시 부산 탐방입니다.",
    actNewcomersTitle: "새가족 환영",
    actNewcomersDesc: "부산에 처음 오셨나요? 저희가 따뜻하게 환영해 드리고, 한국 생활 적응을 도와드리겠습니다.",
    upcomingTitle: "다가오는 행사",
    upcomingEmpty: "현재 예정된 행사가 없습니다. 수련회, 성탄절, 모임 등 다양한 소식을 곧 이곳에서 확인하실 수 있습니다.",
    sectionFind: "오시는 길",
    findTitle: "위치 및 오시는 길",
    findSubtitle: "부산 지하철 등 대중교통으로 매우 편리하게 오실 수 있습니다.",
    bexcoDir: "벡스코역 1번 출구",
    bexcoDist: "1번 출구로 나와 직진 80m (도보 1–2분)",
    addressLabelKorean: "한국어 주소 (내비게이션 / 택시용)",
    copyBtn: "주소 복사",
    openMapLabel: "지도 앱에서 열기:",
    mapNaver: "네이버 지도에서 열기",
    mapKakao: "카카오맵에서 열기",
    mapGoogle: "구글 지도에서 열기",
    contactLabel: "공식 연락처:",
    labelEmail: "이메일:",
    labelInstagram: "인스타그램:",
    labelTiktok: "틱톡:",
    labelYoutube: "유튜브:",
    labelFacebook: "페이스북:",
    labelWhatsapp: "왓츠앱:",
    floorBadge: "2층",
    buildingCaption: "벡스코역 1번 출구에서 직진 80m를 걸어오시면 건물 정문이 바로 보입니다. 2층으로 올라오시면 SIS 예배실이 있습니다.",
    footerDesc: "대한예수교장로회 수영로교회 산하, 부산 지역 인도네시아 공동체를 위한 예배 및 교제 사역입니다.",
    footerNavTitle: "메뉴",
    footerHome: "홈",
    footerVisit: "예배 일정 (Visit Us)",
    footerOnline: "온라인 예배 ↗",
    footerActivities: "공동체 활동",
    footerFind: "위치 및 오시는 길",
    footerContactTitle: "주소 및 연락처",
    footerBexco: "벡스코역 1번 출구 (도보 80m)",
    footerCopyright: "© 2026 수영로교회 인도네시아 예배 (SIS). All Rights Reserved. 대한예수교장로회 수영로교회 부산, 대한민국 소속.",
    floatLocation: "위치",
    floatSchedule: "일정",
    floatLive: "라이브",
    toastDefault: "✓ 주소가 복사되었습니다!",
    toastCopied: "✓ 한국어 주소가 클립보드에 복사되었습니다!"
  }
};

function initLanguageSwitcher() {
  const langBtns = document.querySelectorAll('.lang-btn');

  langBtns.forEach(btn => {
    const isActive = btn.getAttribute('data-lang') === currentLang;
    btn.classList.toggle('active', isActive);

    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (!lang || !translations[lang]) return;

      currentLang = lang;
      try {
        localStorage.setItem('sisLang', lang);
      } catch (e) {
        /* localStorage unavailable (e.g. private mode) — language just won't persist */
      }

      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      applyLanguage(lang);
    });
  });

  applyLanguage(currentLang);

  function applyLanguage(lang) {
    const dict = translations[lang];
    document.documentElement.setAttribute('lang', lang === 'kr' ? 'ko' : lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });
  }
}

/* ==========================================================
   6. Ambient Canvas Particle & Starlight Animation
   ========================================================== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(45, Math.floor((width * height) / 25000));

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.speedY = -(Math.random() * 0.4 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.color = Math.random() > 0.4 ? 'rgba(56, 189, 248,' : 'rgba(245, 158, 11,';
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      if (this.y < 0 || this.x < 0 || this.x > width) {
        this.reset();
        this.y = height;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

/* ==========================================================
   7. Live Cloud Weekly Poster Integration (npoint.io)
   ========================================================== */
const POSTER_CLOUD_ENDPOINT = 'https://api.npoint.io/2b11d95a7b2b7a8a1776';

function initLiveWeeklyPoster() {
  const linkEl = document.getElementById('live-poster-link');
  const imgEl = document.getElementById('live-poster-img');
  const titleEl = document.getElementById('live-poster-title');
  const speakerEl = document.getElementById('live-poster-speaker');
  const scheduleEl = document.getElementById('live-poster-schedule');
  const locationEl = document.getElementById('live-poster-location');
  const descEl = document.getElementById('live-poster-desc');

  if (!linkEl || !imgEl) return;

  function applyPosterData(data) {
    if (!data) return;
    if (data.instagramUrl && linkEl) linkEl.href = data.instagramUrl;
    if (data.imageUrl && imgEl) {
      imgEl.onerror = () => {
        if (!imgEl.dataset.fallbackDone && (data.imageUrl.includes('cdninstagram.com') || data.imageUrl.includes('fbcdn.net'))) {
          imgEl.dataset.fallbackDone = 'true';
          imgEl.src = 'https://images.weserv.nl/?url=' + encodeURIComponent(data.imageUrl);
        } else {
          imgEl.src = './assets/images/weekly-poster.jpg';
        }
      };
      imgEl.src = data.imageUrl;
    }
    if (data.theme && titleEl) {
      titleEl.textContent = data.theme;
      if (translations.id) translations.id.posterTitle = data.theme;
    }
    if (data.speaker && speakerEl) {
      speakerEl.textContent = data.speaker;
      if (translations.id) translations.id.posterSpeaker = data.speaker;
    }
    if (data.schedule && scheduleEl) {
      scheduleEl.textContent = data.schedule;
      if (translations.id) translations.id.posterSchedule = data.schedule;
    }
    if (data.location && locationEl) {
      locationEl.textContent = data.location;
      if (translations.id) translations.id.posterLocation = data.location;
    }
    if (data.description && descEl) {
      descEl.textContent = data.description;
      if (translations.id) translations.id.posterDesc = data.description;
    }
  }

  // 1. Instant apply from cache if available
  try {
    const cached = localStorage.getItem('sis_weekly_service');
    if (cached) applyPosterData(JSON.parse(cached));
  } catch (e) {}

  // 2. Live sync from Cloud Endpoint with cache busting
  fetch(`${POSTER_CLOUD_ENDPOINT}?_t=${Date.now()}`, { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error('Network response not ok');
      return res.json();
    })
    .then(data => {
      applyPosterData(data);
      try {
        localStorage.setItem('sis_weekly_service', JSON.stringify(data));
      } catch (e) {}
    })
    .catch(() => {
      // Quietly preserve static default on offline or network error
    });
}

