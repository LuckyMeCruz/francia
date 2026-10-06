/**
 * OUR MONTHSARY CELEBRATION • OCTOBER 9, 2026
 * Interactive Engine: Countdown, Particles, Audio Synthesizer,
 * Photostrip Lightbox, Love Capsules & Movie VIP Ticket RSVP
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initCanvasStarfield();
  initLoveCapsule();
  initDateTimeListeners();
  initPlayfulNoButton();
  initAudioSynthesizer();
});

/* ==========================================================
   1. LIVE COUNTDOWN TO OCTOBER 9, 2026
   Supports Dubai (GST, UTC+4) and PH (PHT, UTC+8) timezones.
   Dubai is the default view.
   ========================================================== */
let selectedTimezone = 'dubai'; // 'dubai' or 'ph'

// Oct 9 2026 midnight in each timezone, expressed as UTC ms
// Dubai (UTC+4): Oct 9, 2026 00:00 local = Oct 8, 2026 20:00 UTC
const TARGET_DUBAI_UTC = Date.UTC(2026, 9, 8, 20, 0, 0);
// PH (UTC+8): Oct 9, 2026 00:00 local = Oct 8, 2026 16:00 UTC
const TARGET_PH_UTC = Date.UTC(2026, 9, 8, 16, 0, 0);

function getTargetForTz() {
  return selectedTimezone === 'dubai' ? TARGET_DUBAI_UTC : TARGET_PH_UTC;
}

function initCountdown() {
  const daysEl = document.getElementById('daysCount');
  const hoursEl = document.getElementById('hoursCount');
  const minutesEl = document.getElementById('minutesCount');
  const secondsEl = document.getElementById('secondsCount');
  const statusEl = document.getElementById('countdownStatus');
  const clockTimeEl = document.getElementById('tzClockTime');
  const clockLabelEl = document.getElementById('tzClockLabel');

  // Timezone toggle buttons
  const dubaiBtn = document.getElementById('tzDubaiBtn');
  const phBtn = document.getElementById('tzPhBtn');
  const slider = document.getElementById('tzSlider');

  function setTz(tz) {
    selectedTimezone = tz;
    if (dubaiBtn && phBtn) {
      dubaiBtn.classList.toggle('active', tz === 'dubai');
      phBtn.classList.toggle('active', tz === 'ph');
      // Move slider
      if (slider) {
        slider.style.transform = tz === 'dubai' ? 'translateX(0)' : 'translateX(100%)';
      }
    }
    updateClock();
    update();
  }

  if (dubaiBtn) dubaiBtn.addEventListener('click', () => setTz('dubai'));
  if (phBtn) phBtn.addEventListener('click', () => setTz('ph'));

  function updateClock() {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const offsetHours = selectedTimezone === 'dubai' ? 4 : 8;
    const localMs = utcMs + offsetHours * 3600000;
    const localDate = new Date(localMs);

    let h = localDate.getHours();
    const m = String(localDate.getMinutes()).padStart(2, '0');
    const s = String(localDate.getSeconds()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;

    if (clockTimeEl) clockTimeEl.textContent = `${String(h).padStart(2, '0')}:${m}:${s} ${ampm}`;
    if (clockLabelEl) {
      clockLabelEl.textContent = selectedTimezone === 'dubai' ? 'GST (UTC+4)' : 'PHT (UTC+8)';
    }
  }

  function update() {
    const nowUtc = Date.now();
    const target = getTargetForTz();
    const distance = target - nowUtc;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      if (statusEl) {
        statusEl.innerHTML = `<i data-lucide="heart" class="icon-inline" style="color: #ec4899;"></i> <span>HAPPY MONTHSARY, MY BABY! Today is our special day! 🎉❤️</span>`;
        if (window.lucide) lucide.createIcons();
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  setTz('dubai'); // default
  setInterval(() => {
    update();
    updateClock();
  }, 1000);
}

/* ==========================================================
   2. AMBIENT CANVAS BACKGROUND (STARDUST & FLOATING HEARTS)
   ========================================================== */
function initCanvasStarfield() {
  const canvas = document.getElementById('starfieldCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(65, Math.floor(window.innerWidth / 20));

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 50;
      this.size = Math.random() * 3 + 1.2;
      this.speedY = Math.random() * 0.7 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.isHeart = Math.random() > 0.65;
      this.hue = Math.random() > 0.4 ? 330 : 270; // pinks & soft violets
      this.wobble = Math.random() * Math.PI * 2;
    }

    update() {
      this.y -= this.speedY;
      this.wobble += 0.02;
      this.x += this.speedX + Math.sin(this.wobble) * 0.3;

      if (this.y < -30 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      if (this.isHeart) {
        ctx.fillStyle = `hsl(${this.hue}, 85%, 75%)`;
        ctx.font = `${this.size * 3.5}px sans-serif`;
        ctx.fillText('❤', this.x, this.y);
      } else {
        ctx.fillStyle = `hsl(${this.hue}, 80%, 85%)`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsl(${this.hue}, 90%, 70%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    const p = new Particle();
    p.y = Math.random() * height; // distribute initially
    particles.push(p);
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
}

/* ==========================================================
   3. LOVE CAPSULE / RANDOM QUOTES GENERATOR
   ========================================================== */
const romanticQuotes = [
  "“You are my favorite notification, my sweetest distraction, and my deepest peace.”",
  "“In a room full of art, I would still look at you — smiling shyly in our photobooths.”",
  "“Thank you for being the person who makes ordinary days feel like golden memories.”",
  "“No matter how busy life gets, coming back to you is the sweetest feeling in the universe.”",
  "“Falling in love with you wasn't just once; every morning I look at your smile, it happens all over again.”",
  "“I love your laugh — especially the kind where you cover your mouth because it's too genuine to hold back.”",
  "“You make my heart feel like it's resting safely in the warmest, softest home.”",
  "“October 9 is our special date, but loving you is my favorite daily ritual.”",
  "“Here's to our inside jokes, late 5 AM photobooth sessions, and all the love still waiting ahead.”"
];

let currentQuoteIndex = 0;

function initLoveCapsule() {
  const nextBtn = document.getElementById('nextQuoteBtn');
  const quoteText = document.getElementById('capsuleQuoteText');

  if (nextBtn && quoteText) {
    nextBtn.addEventListener('click', () => {
      quoteText.style.opacity = '0';
      quoteText.style.transform = 'translateY(8px)';

      playChimeSound(660);

      setTimeout(() => {
        currentQuoteIndex = (currentQuoteIndex + 1) % romanticQuotes.length;
        quoteText.textContent = romanticQuotes[currentQuoteIndex];
        quoteText.style.opacity = '1';
        quoteText.style.transform = 'translateY(0)';
        createBurstParticles(nextBtn);
      }, 250);
    });
  }
}

/* ==========================================================
   4. PHOTOSTRIP LIGHTBOX MODAL & REACTIONS
   ========================================================== */
window.openLightbox = function (imageSrc, captionText) {
  const modal = document.getElementById('photoLightbox');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');

  if (modal && img && cap) {
    img.src = imageSrc;
    cap.textContent = captionText;
    modal.classList.add('active');
    playChimeSound(520);
  }
};

window.closeLightboxDirectly = function () {
  const modal = document.getElementById('photoLightbox');
  if (modal) modal.classList.remove('active');
};

window.closeLightbox = function (event) {
  if (event.target.id === 'photoLightbox') {
    closeLightboxDirectly();
  }
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightboxDirectly();
});

window.triggerMiniHeart = function (btn) {
  const counter = btn.querySelector('.heart-counter');
  if (counter) {
    counter.textContent = parseInt(counter.textContent || '0', 10) + 1;
  }
  btn.style.transform = 'scale(1.25)';
  setTimeout(() => (btn.style.transform = ''), 200);
  createBurstParticles(btn);
  playChimeSound(784);
};

window.triggerPhotoReaction = function (btn, stripKey) {
  const counter = btn.querySelector('.react-count');
  if (counter) {
    counter.textContent = parseInt(counter.textContent || '0', 10) + 1;
  }
  createBurstParticles(btn);
  playChimeSound(880);
};


/* ==========================================================
   6. DATE & TIME PICKER PREVIEW & LISTENERS
   ========================================================== */
function initDateTimeListeners() {
  const dateInput = document.getElementById('movieDateInput');
  const timeInput = document.getElementById('movieTimeInput');
  const dateDisplay = document.getElementById('dateFriendlyDisplay');
  const timeDisplay = document.getElementById('timeFriendlyDisplay');

  function updateDatePreview() {
    if (!dateInput || !dateDisplay) return;
    const val = dateInput.value;
    if (!val) return;

    const parts = val.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const dateObj = new Date(year, month, day);

      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formatted = dateObj.toLocaleDateString('en-US', options);

      const isMonthsary = (month === 9 && day === 9 && year === 2026);
      dateDisplay.textContent = `📅 ${formatted} ${isMonthsary ? '💖 (Our Monthsary!)' : ''}`;
    }
  }

  function updateTimePreview() {
    if (!timeInput || !timeDisplay) return;
    const val = timeInput.value;
    if (!val) return;

    const parts = val.split(':');
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    const timeFormatted = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    timeDisplay.textContent = `⏰ ${timeFormatted} (Cozy Movie Showtime)`;
  }

  if (dateInput) {
    dateInput.addEventListener('input', updateDatePreview);
    updateDatePreview();
  }

  if (timeInput) {
    timeInput.addEventListener('input', updateTimePreview);
    updateTimePreview();
  }
}

/* ==========================================================
   7. PLAYFUL "NO" BUTTON (RUNAWAY / TEASING)
   ========================================================== */
function initPlayfulNoButton() {
  const noBtn = document.getElementById('playfulNoBtn');
  if (!noBtn) return;

  const playfulMessages = [
    "Hehehe, nice try! 😉",
    "Button out of service! 🥰",
    "404: 'No' Not Found! 💕",
    "Popcorn is already popping! 🍿",
    "I'm not letting you click this! 💖",
    "Our movie date is mandatory! 🌹"
  ];

  let dodgeCount = 0;

  function dodge() {
    dodgeCount++;
    const randomMsg = playfulMessages[dodgeCount % playfulMessages.length];
    noBtn.querySelector('span').textContent = randomMsg;

    // Slight random translation (gentle on mobile to keep within bounds)
    const isSmall = window.innerWidth <= 600;
    const maxShiftX = isSmall ? 18 : 60;
    const xOffset = (Math.random() - 0.5) * maxShiftX;
    const yOffset = (Math.random() - 0.5) * 30;
    noBtn.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    playChimeSound(440);
  }

  noBtn.addEventListener('mouseenter', dodge);
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    dodge();
  });

  noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    dodge();
    alert("System Message: Loving you too much to accept a 'No'! Please click the shiny Yes button! ❤️");
  });
}

/* ==========================================================
   8. RSVP SUBMISSION & VIP TICKET GENERATOR
   ========================================================== */
window.handleRsvpSubmit = function (e) {
  e.preventDefault();

  const dateInput = document.getElementById('movieDateInput');
  const timeInput = document.getElementById('movieTimeInput');
  const snackInput = document.getElementById('snackPreference');

  const selectedDate = dateInput ? dateInput.value : '2026-10-09';
  const selectedTime = timeInput ? timeInput.value : '20:00';
  const snacks = snackInput && snackInput.value.trim() ? snackInput.value : 'Caramel Popcorn & Cuddles';

  // Format date display
  const dateParts = selectedDate.split('-');
  const dateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Format time display
  const timeParts = selectedTime.split(':');
  let h = parseInt(timeParts[0], 10);
  const m = timeParts[1];
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const formattedTime = `${String(h).padStart(2, '0')}:${m} ${ampm}`;

  // Update stub
  const confirmedDateText = document.getElementById('confirmedDateText');
  const confirmedTimeText = document.getElementById('confirmedTimeText');
  const confirmedSnackText = document.getElementById('confirmedSnackText');
  const confirmationStub = document.getElementById('confirmationStub');
  const form = document.getElementById('movieRsvpForm');

  if (confirmedDateText) confirmedDateText.textContent = formattedDate;
  if (confirmedTimeText) confirmedTimeText.textContent = formattedTime;
  if (confirmedSnackText) confirmedSnackText.textContent = snacks;

  if (form) form.style.display = 'none';
  if (confirmationStub) confirmationStub.style.display = 'block';

  // Generate Google Calendar & Meet links
  updateCalendarLinks(selectedDate, selectedTime, snacks);

  // Play Celebration Confetti
  celebrateRsvp();

  // Play Romantic Chime Fanfare
  playCelebrationMelody();
};

window.modifyRsvp = function () {
  const confirmationStub = document.getElementById('confirmationStub');
  const form = document.getElementById('movieRsvpForm');
  if (confirmationStub) confirmationStub.style.display = 'none';
  if (form) form.style.display = 'block';
};

function celebrateRsvp() {
  if (!window.confetti) return;

  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio, opts) {
    window.confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio)
      })
    );
  }

  fire(0.25, { spread: 26, startVelocity: 55, colors: ['#f472b6', '#fbbf24', '#ffffff'] });
  fire(0.2, { spread: 60, colors: ['#ec4899', '#db2777', '#fbcfe8'] });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, colors: ['#fbbf24', '#f59e0b'] });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

/* ==========================================================
   9. GOOGLE CALENDAR INTEGRATION
   ========================================================== */

/**
 * The man's email address to automatically invite as a guest.
 * Replace with your actual Google / Gmail address so the invite reaches your inbox!
 */
const MAN_GUEST_EMAIL = 'franciabautistajuanillo@gmail.com';

/**
 * Build a Google Calendar event creation URL.
 * Automatically attaches date, time, title, notes, and the man's email as guest.
 */
function buildGoogleCalendarUrl(dateStr, timeStr, snacks) {
  const dateParts = dateStr.split('-');
  const timeParts = timeStr.split(':');

  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];
  const hour = timeParts[0];
  const minute = timeParts[1];

  const startDt = `${year}${month}${day}T${hour}${minute}00`;
  // 2 hours duration
  let endHour = parseInt(hour, 10) + 2;
  let endDay = day;
  if (endHour >= 24) {
    endHour = endHour - 24;
    endDay = String(parseInt(day, 10) + 1).padStart(2, '0');
  }
  const endDt = `${year}${month}${endDay}T${String(endHour).padStart(2, '0')}${minute}00`;

  const title = encodeURIComponent('🎬 Monthsary Movie Date: 50 First Dates');
  const details = encodeURIComponent(
    `VIP Monthsary Movie Night Celebration! ❤️\n\n` +
    `🍿 Snack Package: ${snacks}\n\n` +
    `Starring: You & Me\n` +
    `Dress Code: Pajamas & Warm Hugs\n\n` +
    `"Because falling in love with you isn't just a one-time thing — it's something I want to do every single morning."`
  );
  const location = encodeURIComponent('Our Cozy Couch Cinema Lounge');

  let calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDt}/${endDt}&details=${details}&location=${location}`;

  // Automatically pre-fill the man's email in the Guest list
  if (MAN_GUEST_EMAIL && MAN_GUEST_EMAIL.trim() !== '') {
    calendarUrl += `&add=${encodeURIComponent(MAN_GUEST_EMAIL.trim())}`;
  }

  return calendarUrl;
}

/**
 * Called after RSVP confirmation to set the href on the Google Calendar button.
 */
function updateCalendarLinks(dateStr, timeStr, snacks) {
  const calLink = document.getElementById('googleCalendarLink');
  if (calLink) {
    calLink.href = buildGoogleCalendarUrl(dateStr, timeStr, snacks);
  }
}

/* ==========================================================
   10. FLOATING BURST PARTICLES UTILITY
   ========================================================== */
function createBurstParticles(element) {
  const container = document.getElementById('floatingHeartsContainer');
  if (!container) return;

  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const hearts = ['💖', '💕', '✨', '🌸', '❤️'];

  for (let i = 0; i < 8; i++) {
    const el = document.createElement('div');
    el.className = 'floating-heart-particle';
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    const spreadX = (Math.random() - 0.5) * 80;
    el.style.left = `${centerX + spreadX}px`;
    el.style.top = `${centerY}px`;
    el.style.fontSize = `${Math.random() * 14 + 16}px`;

    container.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 2200);
  }
}

/* ==========================================================
   11. PROCEDURAL WEB AUDIO ROMANTIC SYNTHESIZER
   ========================================================== */
let audioCtx = null;
let isMusicPlaying = false;
let musicTimer = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playChimeSound(freq = 587.33) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  } catch (err) {
    // Audio context silently ignored if disallowed
  }
}

function playCelebrationMelody() {
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((note, index) => {
    setTimeout(() => {
      playChimeSound(note);
    }, index * 120);
  });
}

function initAudioSynthesizer() {
  const soundBtn = document.getElementById('soundToggleBtn');
  if (!soundBtn) return;

  // Romantic Pentatonic Music Box Notes (Hz)
  const melodyNotes = [
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99, // G5
    880.00, // A5
    1046.50, // C6
    880.00, // A5
    783.99, // G5
    659.25, // E5
    587.33  // D5
  ];

  let noteIdx = 0;

  function playMelodyLoop() {
    if (!isMusicPlaying) return;
    const ctx = getAudioContext();
    if (ctx) {
      const note = melodyNotes[noteIdx % melodyNotes.length];
      playChimeSound(note);
      noteIdx++;
    }
    musicTimer = setTimeout(playMelodyLoop, 550);
  }

  soundBtn.addEventListener('click', () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    isMusicPlaying = !isMusicPlaying;

    if (isMusicPlaying) {
      soundBtn.classList.add('playing');
      soundBtn.querySelector('.sound-label').textContent = 'Playing';
      playMelodyLoop();
      createBurstParticles(soundBtn);
    } else {
      soundBtn.classList.remove('playing');
      soundBtn.querySelector('.sound-label').textContent = 'Music';
      if (musicTimer) clearTimeout(musicTimer);
    }
  });
}
