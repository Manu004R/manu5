/* ══════════════════════════════════════════════════
   EMMANUEL MAINYE – MANU HUB PORTFOLIO
   script.js  |  Vanilla JavaScript
   All interactions, animations, dynamic rendering
══════════════════════════════════════════════════ */

'use strict';

/* ─── 1. UTILITIES ─────────────────────────────── */

/**
 * Detect approximate connection speed and return
 * a speed factor (slower = smaller, so animations
 * finish quicker on slow connections).
 */
function getConnectionFactor() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) return 1;
  const type = conn.effectiveType;
  return type === '4g' ? 1 : type === '3g' ? 0.75 : 0.5;
}

const connFactor = getConnectionFactor();
const SKELETON_DELAY = Math.round(1600 * connFactor); // faster on slow connections

/** Delay helper */
const delay = ms => new Promise(res => setTimeout(res, ms));

/** Debounce */
function debounce(fn, wait) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

/* ─── 2. NAVBAR ─────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navLoader = document.getElementById('navLoader');
const allNavLinks = document.querySelectorAll('.nav-link');

// Scroll: add .scrolled class
window.addEventListener('scroll', debounce(() => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
}, 50));

// Hamburger toggle
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a link is clicked (mobile)
navLinks.addEventListener('click', e => {
  if (e.target.classList.contains('nav-link')) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  }
});

// Nav link click → blinking dots loader
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLoader.classList.add('active');
    setTimeout(() => navLoader.classList.remove('active'), 600);
  });
});

// Highlight active nav section on scroll
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;

  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = document.querySelector(`.nav-link[data-section="${id}"]`);
    if (link) link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
  });
}

/* ─── 3. SMOOTH SCROLL (enhance anchors) ────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── 4. BACK TO TOP ─────────────────────────────── */
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', debounce(() => {
  backTop.classList.toggle('visible', window.scrollY > 500);
}, 80));
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ─── 5. YEAR AUTO-UPDATE ────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ─── 6. BUTTON LOADING DOTS ─────────────────────── */
/**
 * Adds the .loading class to a button, shows blinking dots,
 * then removes it after `duration` ms.
 */
function triggerBtnLoading(btn, duration = 700) {
  btn.classList.add('loading');
  setTimeout(() => btn.classList.remove('loading'), duration);
}

// All buttons with .btn-dots get the blinking-dots animation on click
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => triggerBtnLoading(btn));
});

/* ─── 7. SERVICES DATA & RENDERING ───────────────── */
const services = [
  {
    icon:  'fa-solid fa-globe',
    title: 'Web Design',
    desc:  'Responsive, modern websites built with clean code — from landing pages to full business portals.',
    label: 'Request Service',
  },
  {
    icon:  'fa-solid fa-palette',
    title: 'Graphic Design',
    desc:  'Logos, flyers, social media graphics and brand identity kits designed to make you stand out.',
    label: 'Request Service',
  },
  {
    icon:  'fa-solid fa-laptop-code',
    title: 'IT Support',
    desc:  'Hardware troubleshooting, software setup, networking, and general technical assistance.',
    label: 'Request Service',
  },
  {
    icon:  'fa-solid fa-id-card',
    title: 'eCitizen Services',
    desc:  'Fast and accurate eCitizen registration, applications, and document processing on your behalf.',
    label: 'Request Service',
  },
  {
    icon:  'fa-solid fa-file-invoice',
    title: 'KRA Services',
    desc:  'KRA PIN registration, iTax returns filing, compliance certificates, and taxpayer support.',
    label: 'Request Service',
  },
];

function renderServices() {
  const grid     = document.getElementById('realServices');
  const skeleton = document.getElementById('servicesGrid');
  const loader   = document.getElementById('servicesLoader');

  // Show loader after skeleton
  setTimeout(() => {
    loader.classList.remove('hidden');
  }, SKELETON_DELAY - 400);

  setTimeout(() => {
    // Hide skeleton + loader
    skeleton.style.display = 'none';
    loader.classList.add('hidden');

    // Build cards
    services.forEach((svc, i) => {
      const card = document.createElement('article');
      card.className = 'service-card reveal';
      card.setAttribute('role', 'listitem');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${svc.title} service`);
      card.style.transitionDelay = `${i * 0.08}s`;

      card.innerHTML = `
        <div class="service-icon" aria-hidden="true">
          <i class="${svc.icon}"></i>
        </div>
        <h3 class="service-title">${svc.title}</h3>
        <p class="service-desc">${svc.desc}</p>
        <span class="service-cta" aria-hidden="true">${svc.label} <i class="fa-solid fa-arrow-right"></i></span>
      `;

      // Click → scroll to contact with loading dots
      card.addEventListener('click', () => {
        triggerBtnLoading(card, 500);
        setTimeout(() => {
          document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }, 300);
      });

      // Keyboard: Enter or Space triggers same as click
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
      });

      grid.appendChild(card);
    });

    grid.classList.remove('hidden');

    // Observe for scroll reveal
    observeReveal();

  }, SKELETON_DELAY);
}

/* ─── 8. TESTIMONIALS DATA & RENDERING ───────────── */
const testimonials = [
  {
    text:   'Emmanuel built my business website from scratch. It looked amazing and was done faster than I expected. Very professional!',
    name:   'Grace Wambui',
    role:   'Small Business Owner',
    stars:  5,
  },
  {
    text:   'I needed my KRA PIN sorted urgently. Emmanuel handled everything quickly and explained every step clearly. Highly recommended!',
    name:   'James Odhiambo',
    role:   'Freelancer',
    stars:  5,
  },
  {
    text:   'The logo he designed for my brand was exactly what I imagined. Great attention to detail and very responsive on WhatsApp.',
    name:   'Amina Hassan',
    role:   'Fashion Entrepreneur',
    stars:  5,
  },
];

function renderTestimonials() {
  const skeleton = document.getElementById('testimonialsGrid');
  const real     = document.getElementById('realTestimonials');

  setTimeout(() => {
    skeleton.style.display = 'none';

    testimonials.forEach((t, i) => {
      const card = document.createElement('article');
      card.className = 'testi-card reveal';
      card.setAttribute('role', 'listitem');
      card.style.transitionDelay = `${i * 0.12}s`;

      const initials = t.name.split(' ').map(w => w[0]).join('');
      const stars    = '★'.repeat(t.stars) + '☆'.repeat(5 - t.stars);

      card.innerHTML = `
        <div class="testi-quote-icon" aria-hidden="true">"</div>
        <p class="testi-text">${t.text}</p>
        <div class="testi-stars" aria-label="${t.stars} out of 5 stars">${stars}</div>
        <div class="testi-author">
          <div class="testi-avatar" aria-hidden="true">${initials}</div>
          <div>
            <div class="testi-name">${t.name}</div>
            <div class="testi-role">${t.role}</div>
          </div>
        </div>
      `;

      real.appendChild(card);
    });

    real.classList.remove('hidden');
    observeReveal();
  }, SKELETON_DELAY + 400);
}

/* ─── 9. SCROLL REVEAL OBSERVER ─────────────────── */
function observeReveal() {
  const targets = document.querySelectorAll('.reveal:not(.visible)');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(el => io.observe(el));
  } else {
    // Fallback
    targets.forEach(el => el.classList.add('visible'));
  }
}

/* ─── 10. COUNTER ANIMATION ─────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => io.observe(c));
  } else {
    counters.forEach(c => { c.textContent = c.dataset.target; });
  }
}

/* ─── 11. CONTACT FORM ───────────────────────────── */
const form       = document.getElementById('contactForm');
const nameField  = document.getElementById('nameField');
const emailField = document.getElementById('emailField');
const svcField   = document.getElementById('serviceField');
const msgField   = document.getElementById('msgField');
const successMsg = document.getElementById('formSuccess');

function showError(id, msg) {
  document.getElementById(id).textContent = msg;
}
function clearErrors() {
  ['nameError','emailError','serviceError','msgError'].forEach(id => {
    document.getElementById(id).textContent = '';
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  clearErrors();

  let valid = true;
  if (!nameField.value.trim())  { showError('nameError',    'Please enter your name.');         valid = false; }
  if (!emailField.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
    showError('emailError', 'Please enter a valid email address.'); valid = false;
  }
  if (!svcField.value)          { showError('serviceError', 'Please select a service.');         valid = false; }
  if (!msgField.value.trim())   { showError('msgError',     'Please enter a message.');           valid = false; }

  if (!valid) return;

  // Show loading state on the submit button
  const submitBtn = form.querySelector('[type="submit"]');
  triggerBtnLoading(submitBtn, 1500);
  submitBtn.disabled = true;

  await delay(1200);

  // Build WhatsApp message
  const waMsg = encodeURIComponent(
    `Hello Emmanuel! I filled your contact form.\n\n` +
    `Name: ${nameField.value.trim()}\n` +
    `Email: ${emailField.value.trim()}\n` +
    `Service: ${svcField.options[svcField.selectedIndex].text}\n\n` +
    `Message: ${msgField.value.trim()}`
  );

  successMsg.classList.remove('hidden');
  form.reset();
  submitBtn.disabled = false;

  // Open WhatsApp after short delay
  setTimeout(() => {
    window.open(`https://wa.me/254707408066?text=${waMsg}`, '_blank', 'noopener,noreferrer');
  }, 1500);
});

/* ─── 12. SCROLL REVEAL: STATIC ELEMENTS ─────────── */
function initStaticReveal() {
  document.querySelectorAll(
    '.about-card, .about-bio-wrap, .news-card, .contact-info, .contact-form-wrap'
  ).forEach(el => el.classList.add('reveal'));

  observeReveal();
}

/* ─── 13. BANNER SPEED (connection-aware) ─────────── */
function initBanner() {
  const track = document.getElementById('bannerTrack');
  if (!track) return;
  // Slow connection → slightly faster scroll (less total time needed)
  const speed = connFactor < 0.75 ? '30s' : '20s';
  track.style.animationDuration = speed;
}

/* ─── 14. KEYBOARD ACCESSIBILITY ────────────────── */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('focus', () => {
    card.style.outline = '3px solid var(--red)';
  });
  card.addEventListener('blur', () => {
    card.style.outline = '';
  });
});

/* ─── 15. ERROR HANDLING: BROKEN IMAGES ─────────── */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    // Replace with a branded fallback
    img.style.background    = 'linear-gradient(135deg, #1a1a1a 60%, #D90429 100%)';
    img.style.borderRadius  = '8px';
    img.style.minHeight     = img.style.minHeight || '80px';
    img.alt = img.alt || 'Image unavailable';
    // Try to hide broken icon by removing src
    // (keeping dimensions via CSS background)
    img.style.color = 'transparent';
    img.style.fontSize = '0';
  });
});

/* ─── 16. TICKER: PAUSE ON HOVER ─────────────────── */
const tickerText = document.getElementById('tickerText');
if (tickerText) {
  tickerText.addEventListener('mouseenter', () => {
    tickerText.style.animationPlayState = 'paused';
  });
  tickerText.addEventListener('mouseleave', () => {
    tickerText.style.animationPlayState = 'running';
  });
}

/* ─── 17. INIT ───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initBanner();
  initStaticReveal();
  renderServices();
  renderTestimonials();
  initCounters();
  updateActiveNav();

  // Skip link helper
  const skip = document.createElement('a');
  skip.href      = '#main';
  skip.className = 'skip-link';
  skip.textContent = 'Skip to main content';
  document.body.prepend(skip);

  document.querySelector('main').id = 'main';
});
