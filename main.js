/* ═══════════════════════════════════════════════════════════
   Antonio Martín — main.js
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── Nav scroll state ───────────────────────────────────── */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── Mobile menu ────────────────────────────────────────── */
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close on link click
mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ─── Scroll reveal ──────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children of groups
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Number(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el, i) => {
  // Stagger within same parent
  const siblings = el.parentElement.querySelectorAll('.reveal');
  const index = Array.from(siblings).indexOf(el);
  el.dataset.delay = index * 80;
  revealObserver.observe(el);
});

/* ─── Hero terminal line reveal ──────────────────────────── */
// After hero name animates in, reveal the subsequent terminal lines
const heroRevealItems = document.querySelectorAll('#h-line2, #h-output, #h-cursor');
let heroDelay = 1400;

heroRevealItems.forEach(el => {
  setTimeout(() => {
    el.classList.add('visible');
  }, heroDelay);
  heroDelay += 250;
});

/* ─── Nav active section highlight ──────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(section => sectionObserver.observe(section));

/* ─── Nav active link styles (injected) ─────────────────── */
const style = document.createElement('style');
style.textContent = `
  .nav-link.active {
    color: var(--py-yellow) !important;
  }
`;
document.head.appendChild(style);

/* ─── Pip-list hover: highlight all same-package-type ───── */
// Adds a subtle scanline-blink effect on pip rows on hover
document.querySelectorAll('.pip-row').forEach(row => {
  row.addEventListener('mouseenter', () => {
    row.style.boxShadow = '0 0 0 1px rgba(255,212,59,0.06) inset';
  });
  row.addEventListener('mouseleave', () => {
    row.style.boxShadow = '';
  });
});

/* ─── Konami code easter egg ─────────────────────────────── */
// Because every good developer site needs one
const konami = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a'
];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konami[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konami.length) {
      konamiIndex = 0;
      triggerMatrixEgg();
    }
  } else {
    konamiIndex = 0;
  }
});

function triggerMatrixEgg() {
  const egg = document.createElement('div');
  egg.style.cssText = `
    position: fixed; inset: 0; z-index: 10000;
    background: #000;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Fira Code', monospace;
    font-size: 1.2rem;
    color: #3FC97E;
    flex-direction: column;
    gap: 1rem;
    cursor: pointer;
    animation: fadeIn 0.4s ease;
  `;

  egg.innerHTML = `
    <div style="font-size: 4rem; margin-bottom: 1rem;">🐍</div>
    <div style="color: #FFD43B; font-size: 1.5rem; font-weight: 700;">$ sudo python3 -m antigravity</div>
    <div style="color: #5C6370; font-size: 0.85rem; margin-top: 0.5rem;">The Zen of Python:</div>
    <div style="color: #98C379; font-size: 0.78rem; text-align: center; max-width: 400px; line-height: 1.8;">
      Beautiful is better than ugly.<br>
      Explicit is better than implicit.<br>
      Simple is better than complex.<br>
      <span style="color: #5C6370;">— Tim Peters</span>
    </div>
    <div style="color: #5C6370; font-size: 0.7rem; margin-top: 2rem;">(click to dismiss)</div>
  `;

  document.head.insertAdjacentHTML('beforeend', `
    <style>@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }</style>
  `);

  egg.addEventListener('click', () => egg.remove());
  document.body.appendChild(egg);
}

/* ─── Smooth anchor scrolling with offset ───────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 60;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── Git entry stagger ──────────────────────────────────── */
// Git log entries reveal with stagger when git-log container is visible
const gitLog = document.querySelector('.git-log');
if (gitLog) {
  const gitObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('.git-entry').forEach((entry, i) => {
          entry.style.opacity = '0';
          entry.style.transform = 'translateX(-12px)';
          entry.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          setTimeout(() => {
            entry.style.opacity = '1';
            entry.style.transform = 'translateX(0)';
          }, i * 120 + 200);
        });
        gitObserver.disconnect();
      }
    },
    { threshold: 0.1 }
  );
  gitObserver.observe(gitLog);
}

/* ─── Stat counter animation ─────────────────────────────── */
// Animate simple integer stats up when they come into view.
// Skips values with colons (times) or complex formats.
const statsBlock = document.querySelector('.about-stats');
if (statsBlock) {
  let animated = false;
  const statsObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        document.querySelectorAll('.stat-val').forEach(el => {
          const text = el.textContent.trim();
          // Skip time formats (contain ':') or already special
          if (text.includes(':')) return;

          // Extract leading prefix (e.g. '~'), number, trailing suffix (e.g. '+', '%')
          const match = text.match(/^([^0-9]*)([0-9]+)([^0-9]*)$/);
          if (!match) return;

          const prefix = match[1];
          const num = parseInt(match[2], 10);
          const suffix = match[3];
          if (isNaN(num)) return;

          const duration = 1200;
          const steps = 40;
          let current = 0;
          const increment = num / steps;
          const interval = duration / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= num) {
              current = num;
              clearInterval(timer);
            }
            el.textContent = prefix + Math.round(current) + suffix;
          }, interval);
        });
      }
    },
    { threshold: 0.4 }
  );
  statsObserver.observe(statsBlock);
}

/* ─── Terminal typing effect for hero cmd ───────────────── */
// Type out the 'whoami' command character by character
window.addEventListener('load', () => {
  const cmdEl = document.querySelector('#h-line1 .t-cmd');
  if (!cmdEl) return;

  const text = cmdEl.textContent;
  cmdEl.textContent = '';

  let i = 0;
  const typeInterval = setInterval(() => {
    cmdEl.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(typeInterval);
  }, 80);
});
