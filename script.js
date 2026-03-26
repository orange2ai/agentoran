/* ═══════════════════════════════════════
   AGENT ORAN — script.js
   ═══════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. Scroll Reveal ── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ── 2. Cursor glow (desktop only) ── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let mouseX = -1000, mouseY = -1000;
    let glowX = -1000, glowY = -1000;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  /* ── 3. Particle background ── */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // Sparse particle field
  const PARTICLE_COUNT = Math.min(60, Math.floor(window.innerWidth / 20));

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.size = Math.random() * 1.2 + 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.fadeSpeed = Math.random() * 0.003 + 0.001;
      this.fading = false;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha * 0.7;
      ctx.fillStyle = '#FF6B00';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

  // Subtle grid lines
  function drawGrid() {
    const gridSize = 80;
    ctx.strokeStyle = 'rgba(255, 107, 0, 0.025)';
    ctx.lineWidth = 1;

    const cols = Math.ceil(canvas.width / gridSize);
    const rows = Math.ceil(canvas.height / gridSize);

    for (let i = 0; i <= cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, canvas.height);
      ctx.stroke();
    }

    for (let j = 0; j <= rows; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * gridSize);
      ctx.lineTo(canvas.width, j * gridSize);
      ctx.stroke();
    }
  }

  let animFrame;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    animFrame = requestAnimationFrame(animate);
  }

  animate();

  /* ── 4. Nav scroll transparency ── */
  const nav = document.querySelector('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.background = 'rgba(8, 8, 8, 0.95)';
      nav.style.backdropFilter = 'blur(12px)';
      nav.style.borderBottom = '1px solid rgba(242, 237, 232, 0.06)';
    } else {
      nav.style.background = '';
      nav.style.backdropFilter = '';
      nav.style.borderBottom = '';
    }
  }, { passive: true });

  /* ── 5. Hero name letter hover effect ── */
  const heroName = document.querySelector('.hero-name');

  if (heroName) {
    heroName.style.cursor = 'default';

    heroName.addEventListener('mousemove', (e) => {
      const rect = heroName.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const skew = (relX - 0.5) * 4;
      heroName.style.transform = `skewX(${skew}deg)`;
    });

    heroName.addEventListener('mouseleave', () => {
      heroName.style.transform = 'skewX(0deg)';
      heroName.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
    });

    heroName.addEventListener('mouseenter', () => {
      heroName.style.transition = 'transform 0.1s ease';
    });
  }

  /* ── 6. Work cards — orange corner accent on hover ── */
  const cards = document.querySelectorAll('.work-card');

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = 'inset 2px 2px 0 0 rgba(255, 107, 0, 0.35)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });

  /* ── 7. Social links — line fill on hover ── */
  const socialLinks = document.querySelectorAll('a.social-link');

  socialLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      link.style.paddingLeft = '8px';
      link.style.transition = 'padding 0.2s ease';
    });

    link.addEventListener('mouseleave', () => {
      link.style.paddingLeft = '';
    });
  });

})();
