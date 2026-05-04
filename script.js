/* ===================================
   SCRIPT.JS — FIXED & CLEAN VERSION
=================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ──────────────────────────────────
     1. PARTICLE BACKGROUND
     FIX: Fewer particles on mobile (performance)
     FIX: Resize redraws particle positions properly
  ────────────────────────────────── */
  const canvas = document.getElementById("particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let w, h;
    let animFrameId;

    const isMobile = () => window.innerWidth <= 768;

    function spawnParticles() {
      particles = [];
      const count = isMobile() ? 30 : 70; // FIX: mobile pe kam particles
      for (let i = 0; i < count; i++) {
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
      spawnParticles(); // FIX: resize pe naye particles spawn
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const linkDist = isMobile() ? 80 : 120; // FIX: mobile pe chhoti link distance

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(69,231,255,${0.12 * (1 - dist / linkDist)})`;
            ctx.lineWidth   = 0.6;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(69,231,255,0.65)";
        ctx.fill();
      });

      animFrameId = requestAnimationFrame(draw);
    }

    // FIX: Page hidden hone pe animation pause (battery save)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrameId);
      } else {
        draw();
      }
    });

    draw();
  }


  /* ──────────────────────────────────
     2. SCROLL REVEAL
     FIX: Hero section hidden nahi hoga — direct show
  ────────────────────────────────── */
  const revealStyle = document.createElement("style");
  revealStyle.innerHTML = `
    .hidden {
      opacity: 0;
      transform: translateY(36px);
      transition: opacity .7s ease, transform .7s ease;
    }
    .show {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(revealStyle);

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 }); // FIX: 0.12 → 0.08, mobile pe bade cards miss nahi honge

  document.querySelectorAll("section, .card, .result-box, .t-card").forEach(el => {
    // FIX: Hero section pehle se visible rahe
    if (el.classList.contains("hero")) {
      el.classList.add("show");
      return;
    }
    el.classList.add("hidden");
    revealObserver.observe(el);
  });


  /* ──────────────────────────────────
     3. NAVBAR SCROLL HIDE (mobile only)
     FIX: Menu open ho toh navbar hide na ho
  ────────────────────────────────── */
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      if (window.innerWidth > 768) return;

      // FIX: Menu open hone pe navbar mat chhupao
      const navLinks = document.getElementById("navLinks");
      if (navLinks && navLinks.classList.contains("open")) return;

      const current = window.scrollY;
      if (current > lastScroll && current > 80) {
        navbar.style.transform  = "translateY(-100%)";
        navbar.style.transition = "transform 0.3s ease";
      } else {
        navbar.style.transform = "translateY(0)";
      }
      lastScroll = current;
    }, { passive: true }); // FIX: passive listener — scroll smooth hoga
  }


  /* ──────────────────────────────────
     4. ANIMATED STAT COUNTERS
     FIX: threshold 0.5 → 0.3 (mobile pe trigger miss nahi hoga)
     FIX: data-target na ho toh skip karo (error prevent)
     HTML mein yeh format use karo:
       <h3 class="count" data-target="50" data-suffix="+">50+</h3>
       <h3 class="count" data-target="3" data-suffix="X">3X</h3>
       <h3 class="count" data-target="24" data-suffix="/7">24/7</h3>
  ────────────────────────────────── */
  function animateCounter(el, target, suffix) {
    let count = 0;
    const step  = Math.max(1, Math.ceil(target / 50));
    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count + (suffix || "");
      if (count >= target) clearInterval(timer);
    }, 35);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      if (!target) return; // FIX: target na ho toh skip
      animateCounter(el, target, el.dataset.suffix || "");
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.3 }); // FIX: 0.5 → 0.3

  document.querySelectorAll(".count, .rcount").forEach(c => counterObserver.observe(c));


  /* ──────────────────────────────────
     5. HAMBURGER MENU
     FIX: Escape key se menu band ho
     FIX: Navbar show karo jab menu open ho
  ────────────────────────────────── */
  const menuBtn  = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    if (!menuBtn || !navLinks) return;
    menuBtn.classList.remove("open");
    navLinks.classList.remove("open");
    document.body.style.overflow = "";
    // FIX: Menu band hone pe navbar wapas dikhao
    if (navbar) navbar.style.transform = "translateY(0)";
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuBtn.classList.toggle("open");
      document.body.style.overflow = isOpen ? "hidden" : "";
      // FIX: Menu open hone pe navbar hamesha dikhao
      if (navbar && isOpen) navbar.style.transform = "translateY(0)";
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    // FIX: Escape key se menu band
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }


  /* ──────────────────────────────────
     6. CONTACT FORM
     FIX: Basic validation — empty fields pe error
  ────────────────────────────────── */
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  if (contactForm && formSuccess) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // FIX: Empty fields check
      const inputs = contactForm.querySelectorAll("input, textarea");
      let valid = true;
      inputs.forEach(inp => {
        if (!inp.value.trim()) {
          inp.style.borderColor = "rgba(255, 80, 80, 0.6)";
          valid = false;
        } else {
          inp.style.borderColor = "";
        }
      });
      if (!valid) return;

      contactForm.style.display = "none";
      formSuccess.style.display = "block";
    });
  }

}); // end DOMContentLoaded
