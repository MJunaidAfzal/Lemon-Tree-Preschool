/* LEMON TREE PRE-SCHOOL — site interactions */
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- rainbow lettering ---------- */
  $$('.rainbow').forEach(el => {
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(' ').map(word =>
      '<span style="display:inline-block;white-space:nowrap" aria-hidden="true">' +
      word.split('').map(ch => '<span>' + ch + '</span>').join('') + '</span>'
    ).join(' ');
    // flatten so nth-child colouring runs across the whole phrase
    const letters = $$('span > span', el);
    const palette = ['var(--berry)', 'var(--orange)', 'var(--lemon-deep)', 'var(--leaf)', 'var(--sky)', 'var(--grape)'];
    letters.forEach((l, i) => { l.style.color = palette[i % palette.length]; });
  });

  /* ---------- header on scroll + back to top ---------- */
  const header = $('.site-header');
  const backTop = $('.back-top');
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 60);
    if (backTop) backTop.classList.toggle('show', y > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- mobile nav ---------- */
  const burger = $('.burger');
  if (burger) {
    burger.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open);
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') document.body.classList.remove('nav-open'); });
  }
  $$('.nav > li > button').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 1060px)').matches) {
        const li = btn.parentElement;
        $$('.nav > li.open').forEach(o => { if (o !== li) o.classList.remove('open'); });
        li.classList.toggle('open');
      }
    });
  });

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- gallery filter + lightbox ---------- */
  const items = $$('.g-item');
  if (items.length) {
    const filters = $$('.filters button');
    filters.forEach(f => f.addEventListener('click', () => {
      filters.forEach(x => x.classList.toggle('active', x === f));
      const cat = f.dataset.filter;
      items.forEach(it => it.classList.toggle('hide', cat !== 'all' && it.dataset.cat !== cat));
    }));
  }
  const lbItems = $$('[data-lightbox]');
  const lb = $('.lightbox');
  if (lb && lbItems.length) {
    const lbImg = $('img', lb), lbCap = $('p', lb);
    let current = 0;
    const visible = () => lbItems.filter(it => !it.classList.contains('hide'));
    const show = i => {
      const list = visible();
      current = (i + list.length) % list.length;
      const img = $('img', list[current]);
      lbImg.src = list[current].getAttribute('href') || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = img.alt + ' — ' + (current + 1) + ' / ' + list.length;
    };
    lbItems.forEach(it => it.addEventListener('click', e => {
      e.preventDefault();
      show(visible().indexOf(it));
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }));
    const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', e => { e.stopPropagation(); show(current - 1); });
    $('.lb-next', lb).addEventListener('click', e => { e.stopPropagation(); show(current + 1); });
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ---------- blog pager ---------- */
  const posts = $$('.posts .post');
  const pager = $('.pager');
  if (pager && posts.length) {
    const per = 9, pages = Math.ceil(posts.length / per);
    const go = n => {
      posts.forEach((p, i) => { p.style.display = Math.floor(i / per) === n ? '' : 'none'; });
      $$('button', pager).forEach((b, i) => b.classList.toggle('active', i === n));
    };
    for (let i = 0; i < pages; i++) {
      const b = document.createElement('button');
      b.textContent = i + 1;
      b.setAttribute('aria-label', 'Page ' + (i + 1));
      b.addEventListener('click', () => { go(i); $('.posts').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      pager.appendChild(b);
    }
    go(0);
  }

  /* ---------- forms (front-end only) ---------- */
  $$('form[data-demo]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const note = $('.form-note', form);
      if (note) note.textContent = form.dataset.demo;
      form.reset();
    });
  });

  /* ---------- footer year ---------- */
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
