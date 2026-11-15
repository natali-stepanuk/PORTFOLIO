// Якщо в системі ввімкнено «зменшити рух», зупиняємо анімацію SVG-логотипа.
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('svg:not(.logo__mark)').forEach((svg) => svg.pauseAnimations?.());
}

// Меню-бургер на вузьких екранах.
const burger = document.querySelector('.burger');
const nav = document.getElementById('nav');
if (burger && nav) {
  const setOpen = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
    nav.classList.toggle('is-open', open);
  };
  burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => e.target.closest('a') && setOpen(false));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
}

// Розумна шапка: ховається при прокрутці вниз і повертається при прокрутці вгору.
const header = document.querySelector('.header');
if (header) {
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const menuOpen = document.querySelector('.burger')?.getAttribute('aria-expanded') === 'true';
    const delta = y - lastY;

    if (y < 80 || menuOpen || header.matches(':focus-within')) {
      header.classList.remove('is-hidden');
    } else if (delta > 6) {
      header.classList.add('is-hidden');
    } else if (delta < -6) {
      header.classList.remove('is-hidden');
    }

    if (Math.abs(delta) > 6) lastY = y;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
}

// Плавна поява елементів при прокрутці.
const items = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => observer.observe(el));
} else {
  items.forEach((el) => el.classList.add('is-visible'));
}
