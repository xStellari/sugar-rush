/* =============================================
   SUGAR RUSH — script.js (v4)
============================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Nav scroll shadow ─────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* ── Active nav link by page ───────────── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .footer-nav a, .mobile-drawer a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Mobile burger ─────────────────────── */
  const burger = document.getElementById('navBurger');
  const drawer = document.getElementById('mobileDrawer');
  burger?.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    burger.textContent = open ? '✕' : '☰';
  });
  drawer?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      burger.textContent = '☰';
    });
  });

  /* ── Scroll reveal ─────────────────────── */
  const ro = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const sibs = [...entry.target.parentElement.children].filter(el => el.classList.contains('reveal'));
      const idx  = sibs.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 80);
      ro.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

  /* ── Hero slideshow — 2.2s interval ────── */
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
    function heroStart() { timer = setInterval(() => heroGo(cur + 1), 2200); }
    function heroStop()  { clearInterval(timer); }

    dots.forEach(d => d.addEventListener('click', () => { heroStop(); heroGo(+d.dataset.idx); heroStart(); }));
    heroPanel.addEventListener('mouseenter', heroStop);
    heroPanel.addEventListener('mouseleave', heroStart);

    // Swipe
    let tx = 0;
    heroPanel.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    heroPanel.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 40) { heroStop(); heroGo(cur + (dx < 0 ? 1 : -1)); heroStart(); }
    }, { passive: true });

    heroStart();
  }

  /* ── Product thumbnail switcher ────────── */
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

  /* ── Gallery filter ────────────────────── */
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

  /* ── Lightbox ───────────────────────────── */
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
  function closeLb() { lb?.classList.remove('open'); document.body.style.overflow = ''; }
  lbClose?.addEventListener('click', closeLb);
  lb?.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

  /* ── Order: flavor toggle ───────────────── */
  document.querySelectorAll('.flavor-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('selected'));
  });

  /* ── Order: min date tomorrow ───────────── */
  const pickupInput = document.getElementById('pickup');
  if (pickupInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    pickupInput.min = tomorrow.toISOString().split('T')[0];
  }

  /* ── Order: form submit ─────────────────── */
  document.getElementById('orderForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    this.style.display = 'none';
    const success = document.getElementById('formSuccess');
    success.style.display = 'block';
    window.scrollTo({ top: success.offsetTop - 100, behavior: 'smooth' });
  });

});
