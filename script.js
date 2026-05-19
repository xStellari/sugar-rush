/* =============================================
   SUGAR RUSH — script.js (v6)
============================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Nav scroll shadow ───────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* ── Active nav link by current page ─────── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .footer-nav a, .mobile-drawer a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Mobile burger ───────────────────────── */
  const burger = document.getElementById('navBurger');
  const drawer = document.getElementById('mobileDrawer');

  burger?.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    burger.textContent = isOpen ? '✕' : '☰';
  });

  // Close drawer when a link is tapped
  drawer?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      burger.textContent = '☰';
    });
  });

  // Close drawer when clicking outside
  document.addEventListener('click', e => {
    if (drawer?.classList.contains('open') &&
        !drawer.contains(e.target) &&
        !burger.contains(e.target)) {
      drawer.classList.remove('open');
      burger.textContent = '☰';
    }
  });

  /* ── Scroll reveal ───────────────────────── */
  const ro = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // Stagger siblings that are all .reveal inside the same parent
      const sibs = [...entry.target.parentElement.children]
        .filter(el => el.classList.contains('reveal'));
      const idx = sibs.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 90);
      ro.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

  /* ── Hero slideshow — 2.2 s ──────────────── */
  const heroPanel = document.querySelector('.hero-slideshow-panel');
  if (heroPanel) {
    const slides = heroPanel.querySelectorAll('.hero-slide');
    const dots   = heroPanel.querySelectorAll('.dot');
    let cur = 0, timer;

    function heroGo(idx) {
      slides[cur].classList.remove('active');
      dots[cur]?.classList.remove('active');
      cur = (idx + slides.length) % slides.length;
      slides[cur].classList.add('active');
      dots[cur]?.classList.add('active');
    }
    function start() { timer = setInterval(() => heroGo(cur + 1), 2200); }
    function stop()  { clearInterval(timer); }

    dots.forEach(d => d.addEventListener('click', () => { stop(); heroGo(+d.dataset.idx); start(); }));
    heroPanel.addEventListener('mouseenter', stop);
    heroPanel.addEventListener('mouseleave', start);

    // Touch swipe
    let touchX = 0;
    heroPanel.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    heroPanel.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) { stop(); heroGo(cur + (dx < 0 ? 1 : -1)); start(); }
    }, { passive: true });

    start();
  }

  /* ── Product thumbnail switcher ──────────── */
  document.querySelectorAll('.product-images').forEach(block => {
    const mainImg = block.querySelector('.product-main-img img');
    const thumbs  = block.querySelectorAll('.thumb');
    thumbs[0]?.classList.add('active');
    thumbs.forEach(th => {
      th.addEventListener('click', () => {
        mainImg.src = th.querySelector('img').src;
        thumbs.forEach(t => t.classList.remove('active'));
        th.classList.add('active');
      });
    });
  });

  /* ── Gallery filter ──────────────────────── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      galleryItems.forEach(item => {
        item.classList.toggle('hidden', cat !== 'all' && item.dataset.cat !== cat);
      });
    });
  });

  /* ── Gallery lightbox ────────────────────── */
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lbImg');
  const lbClose = document.getElementById('lb-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      if (!lb) return;
      lbImg.src = item.querySelector('img').src;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLb() {
    lb?.classList.remove('open');
    document.body.style.overflow = '';
  }
  lbClose?.addEventListener('click', closeLb);
  lb?.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

  /* ── Flavor card toggle (order page) ─────── */
  document.querySelectorAll('.flavor-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('selected'));
  });

  /* ── Pickup date: min = tomorrow ─────────── */
  const pickupInput = document.getElementById('pickup');
  if (pickupInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    pickupInput.min = tomorrow.toISOString().split('T')[0];
  }

  /* ── Order form: show success if redirected back ── */
  if (new URLSearchParams(location.search).get('success') === 'true') {
    const form    = document.getElementById('orderForm');
    const success = document.getElementById('formSuccess');
    if (form && success) {
      form.style.display    = 'none';
      success.style.display = 'block';
    }
  }

});

  /* ── Add-on checkbox visual toggle ─────── */
  document.querySelectorAll('.addon-item').forEach(item => {
    const cb = item.querySelector('input[type="checkbox"]');
    cb?.addEventListener('change', () => {
      item.classList.toggle('selected', cb.checked);
    });
  });
