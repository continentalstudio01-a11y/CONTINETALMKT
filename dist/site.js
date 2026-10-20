(() => {
  const menu = document.getElementById('menu');
  const nav = document.getElementById('nav');
  if (menu && nav) {
    const closeMenu = () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Abrir menu');
    };
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); }
    });
    document.addEventListener('click', e => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !menu.contains(e.target)) closeMenu();
    });
  }

  const track = (event,channel,service,placement) => window.Continental?.track(event,{channel,service,placement});
  const form = document.getElementById('briefing');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const f = form.elements;
    const message = 'Olá, Continental MKT! Gostaria de uma proposta.\nEmpresa: ' + f.namedItem('business').value.trim() + '\nCidade: ' + f.namedItem('city').value.trim() + '\nServiço: ' + f.namedItem('service').value + '\nObjetivo: ' + f.namedItem('goal').value.trim();
    track('briefing_submit', 'whatsapp', f.namedItem('service').value, 'form');
    const href='https://wa.me/5588997057623?text=' + encodeURIComponent(message);
    location.assign(window.Continental?.contactUrl(href)||href);
  });

  const floatTargets = document.querySelectorAll('.channel,.extra-services span,.audience-tags span,.related-services a');
  floatTargets.forEach((el, index) => {
    el.classList.add('float-control');
    el.style.setProperty('--float-duration', (4.8 + (index % 4) * .4) + 's');
    el.style.setProperty('--float-delay', (-index * .55) + 's');
  });
  const floatPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let floatObserver;
  const syncFloat = () => {
    if (floatObserver) floatObserver.disconnect();
    floatTargets.forEach(el => el.classList.remove('is-floating'));
    if (floatPreference.matches || !('IntersectionObserver' in window)) return;
    floatObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('is-floating', entry.isIntersecting));
    }, { threshold: .15 });
    floatTargets.forEach(el => floatObserver.observe(el));
  };
  syncFloat();
  floatPreference.addEventListener('change', syncFloat);
  document.addEventListener('visibilitychange', () => {
    document.documentElement.classList.toggle('motion-paused', document.hidden);
  });

  if (!document.documentElement.classList.contains('motion-ready')) return;
  const targets = document.querySelectorAll('.hero .eyebrow,.hero h1,.hero .lead,.hero .actions,.hero .hero-note,.hero .audience-tags,.hero .showcase,.section-head,.cards .service,.brand-showcase,#metodo>div,.about-copy,.portrait-frame,.result-card,.price,.faq-list details,#contato .cta>.eyebrow,#contato .cta>h2,#contato .cta>p,#contato .contact-channels,#contato .contact-panel,#contato .contact-info,.detail-hero>.eyebrow,.detail-hero>h1,.detail-hero>.lead,.detail-hero>.pill,.detail-main,.detail-aside,.detail-faq>h2');
  const hero = [...document.querySelectorAll('.hero>.eyebrow,.hero>h1,.hero>.lead,.hero>.actions,.hero>.hero-note,.hero>.audience-tags,.hero>.showcase')];
  targets.forEach(el => el.classList.add('reveal'));
  const delayFor = el => {
    const index = hero.indexOf(el);
    if (index >= 0) return Math.min(index * 75, 300);
    if (el.matches('.cards .service,.price,.faq-list details')) return ([...el.parentElement.children].indexOf(el) % 3) * 85;
    if (el.matches('.result-card')) return [...el.parentElement.children].indexOf(el) * 110;
    return 0;
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target, delay = delayFor(el);
      if (delay) {
        el.style.setProperty('--enter-delay', delay + 'ms');
        el.addEventListener('transitionend', function done(e) {
          if (e.propertyName !== 'opacity') return;
          el.style.removeProperty('--enter-delay');
          el.removeEventListener('transitionend', done);
        });
      }
      el.classList.add('is-visible');
      observer.unobserve(el);
    });
  }, { threshold: .08, rootMargin: '0px 0px 60px 0px' });
  targets.forEach(el => observer.observe(el));
  const chart = document.querySelector('.chart');
  let chartObserver;
  if (chart) {
    chartObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { chart.classList.add('chart-play'); chartObserver.disconnect(); }
    }, { threshold: .6, rootMargin: '0px 0px -30px 0px' });
    chartObserver.observe(chart);
  }
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
    if (e.matches) {
      document.documentElement.classList.remove('motion-ready');
      observer.disconnect();
      if (chartObserver) chartObserver.disconnect();
    }
  });
})();
