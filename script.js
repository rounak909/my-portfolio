/* ===================================
   SCRIPT.JS — FINAL VERSION (SPEED OPTIMIZED)
=================================== */

document.addEventListener("DOMContentLoaded", function () {

  const isMobileDevice = window.matchMedia("(max-width: 768px)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ──────────────────────────────────
     1. PARTICLE BACKGROUND (Desktop only)
  ────────────────────────────────── */
  const canvas = document.getElementById("particles");
  if (canvas && !isMobileDevice && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d", { alpha: true });
    let particles = [];
    let w, h;
    let animFrameId;
    let lastFrameTime = 0;
    const FRAME_INTERVAL = 1000 / 30;
    const linkDistSq = 120 * 120;

    function spawnParticles() {
      particles = [];
      for (let i = 0; i < 40; i++) {
        particles.push({
          x:  Math.random() * w,
          y:  Math.random() * h,
          r:  Math.random() * 1.8 + 0.6,
          dx: (Math.random() - 0.5) * 0.7,
          dy: (Math.random() - 0.5) * 0.7
        });
      }
    }

    function resize() {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
      spawnParticles();
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    }, { passive: true });

    resize();

    function draw(currentTime) {
      animFrameId = requestAnimationFrame(draw);
      const delta = currentTime - lastFrameTime;
      if (delta < FRAME_INTERVAL) return;
      lastFrameTime = currentTime - (delta % FRAME_INTERVAL);

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
      }

      ctx.strokeStyle = "rgba(69,231,255,0.12)";
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          if (dx * dx + dy * dy < linkDistSq) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = "rgba(69,231,255,0.65)";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrameId);
      } else {
        lastFrameTime = performance.now();
        animFrameId = requestAnimationFrame(draw);
      }
    });

    animFrameId = requestAnimationFrame(draw);
  }


  /* ──────────────────────────────────
     2. SCROLL REVEAL
  ────────────────────────────────── */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  document.querySelectorAll("section").forEach(el => {
    if (el.classList.contains("hero")) { el.classList.add("show"); return; }
    el.classList.add("hidden");
    revealObserver.observe(el);
  });

  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => {
        entry.target.classList.add("card-show");
        entry.target.classList.remove("card-hidden");
      }, i * 80);
      cardObserver.unobserve(entry.target);
    });
  }, { threshold: 0.05 });

  document.querySelectorAll(".card, .result-box, .t-card").forEach(el => {
    el.classList.add("card-hidden");
    cardObserver.observe(el);
  });


  /* ──────────────────────────────────
     3. NAVBAR SCROLL HIDE (mobile)
  ────────────────────────────────── */
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    let lastScroll = 0;
    let ticking = false;
    let isMobileView = window.matchMedia("(max-width: 768px)").matches;
    navbar.style.transition = "transform 0.3s ease";

    window.matchMedia("(max-width: 768px)").addEventListener("change", (e) => {
      isMobileView = e.matches;
      if (!isMobileView) navbar.style.transform = "translateY(0)";
    });

    function updateNavbar() {
      ticking = false;
      if (!isMobileView) return;
      const navLinksEl = document.getElementById("navLinks");
      if (navLinksEl && navLinksEl.classList.contains("open")) return;
      const current = window.scrollY;
      navbar.style.transform = (current > lastScroll && current > 80)
        ? "translateY(-100%)"
        : "translateY(0)";
      lastScroll = current;
    }

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }, { passive: true });
  }


  /* ──────────────────────────────────
     4. ANIMATED STAT COUNTERS
  ────────────────────────────────── */
  function animateCounter(el, target, suffix) {
    const duration = 1500;
    const startTime = performance.now();
    function update(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased) + (suffix || "");
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + (suffix || "");
      }
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      if (!target) return;
      animateCounter(el, target, el.dataset.suffix || "");
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll(".count, .rcount").forEach(c => counterObserver.observe(c));


  /* ──────────────────────────────────
     5. HAMBURGER MENU
  ────────────────────────────────── */
  const menuBtn  = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    if (!navLinks) return;
    navLinks.classList.remove("open");
    if (menuBtn) menuBtn.classList.remove("open");
    document.body.style.overflow = "";
    if (navbar) navbar.style.transform = "translateY(0)";
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle("open");
      menuBtn.classList.toggle("open");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (e) => {
      if (!navLinks.classList.contains("open")) return;
      if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
    });

    document.addEventListener("touchstart", (e) => {
      if (!navLinks.classList.contains("open")) return;
      if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
    }, { passive: true });
  }


  /* ──────────────────────────────────
     6. CONTACT FORM
  ────────────────────────────────── */
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  if (contactForm && formSuccess) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const inputs = contactForm.querySelectorAll("input, textarea");
      let valid = true;
      inputs.forEach(inp => {
        if (!inp.value.trim()) {
          inp.classList.add("error");
          valid = false;
        } else {
          inp.classList.remove("error");
        }
      });
      if (!valid) return;

      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalText = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) { submitBtn.textContent = "Sending..."; submitBtn.disabled = true; }

      try {
        const formData = new FormData(contactForm);

        const response = await fetch("https://formspree.io/f/xwvjlqjn", {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });

        contactForm.style.display = "none";
        formSuccess.style.display = "block";

      } catch (err) {
        contactForm.style.display = "none";
        formSuccess.style.display = "block";
      } finally {
        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      }
    });
  }


  /* ──────────────────────────────────
     7. WHATSAPP TRACKING
  ────────────────────────────────── */
  const waBtn = document.querySelector(".whatsapp-float");
  if (waBtn) {
    waBtn.addEventListener("click", () => {
      if (typeof gtag !== "undefined") {
        gtag("event", "whatsapp_click", {
          event_category: "Contact",
          event_label: "WhatsApp Float Button"
        });
      }

      if (typeof fbq !== "undefined") {
        fbq("track", "Contact");
      }
    });
  }

}); // end DOMContentLoaded
