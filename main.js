/* Lan&Chris · comportamiento (JS clásico, sin módulos) */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  function safe(fn, name) {
    try { fn(); } catch (e) { if (window.console) console.warn('LanyChris: fallo en ' + name, e); }
  }

  /* barra superior que se oscurece al bajar */
  function initNav() {
    var nav = document.getElementById('nav');
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    if (!nav) return;

    function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 30); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!toggle || !links) return;
    function setOpen(open) {
      links.classList.toggle('is-open', open);
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
  }

  /* aparición progresiva con red de seguridad */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    function showAll() { items.forEach(function (el) { el.classList.add('is-in'); }); }

    if (!('IntersectionObserver' in window)) { showAll(); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -5% 0px' });

    items.forEach(function (el) { io.observe(el); });
    setTimeout(showAll, 6000); /* si algo falla, todo se muestra igualmente */
  }

  /* chispas de soldadura en la portada */
  function initSparks() {
    var canvas = document.getElementById('sparks');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var hero = canvas.parentElement;
    var parts = [];
    var w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var visible = true;
    var MAX = window.innerWidth < 760 ? 45 : 90;

    function resize() {
      w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function spawn() {
      /* nacen en el punto de soldadura del logo y saltan hacia arriba */
      var logo = document.getElementById('heroLogo');
      var ox = w * 0.7, oy = h * 0.5;
      if (logo) {
        var lr = logo.getBoundingClientRect();
        var hr = hero.getBoundingClientRect();
        ox = lr.left - hr.left + lr.width * 0.81;
        oy = lr.top - hr.top + lr.height * 0.53;
      }
      var a = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
      var s = 1.5 + Math.random() * 4.5;
      parts.push({
        x: ox, y: oy,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s,
        life: 0, max: 40 + Math.random() * 50,
        r: 0.8 + Math.random() * 1.6
      });
    }

    function frame() {
      requestAnimationFrame(frame);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      if (parts.length < MAX && Math.random() < 0.7) { spawn(); spawn(); }
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.life++;
        p.vy += 0.12;
        p.vx *= 0.99;
        var px = p.x, py = p.y;
        p.x += p.vx; p.y += p.vy;
        var t = p.life / p.max;
        if (t >= 1 || p.y > h) { parts.splice(i, 1); continue; }
        var alpha = 1 - t;
        ctx.strokeStyle = 'rgba(255,' + Math.round(150 - 60 * t) + ',20,' + (alpha * 0.95).toFixed(2) + ')';
        ctx.lineWidth = p.r;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(hero);
    }
    frame();
  }

  function initYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  safe(initNav, 'initNav');
  safe(initReveal, 'initReveal');
  safe(initSparks, 'initSparks');
  safe(initYear, 'initYear');
})();
