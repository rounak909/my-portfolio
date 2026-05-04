/* ===================================
   SCRIPT.JS — FINAL CLEAN VERSION
=================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ──────────────────────────────────
     1. PARTICLE BACKGROUND
     Uses existing <canvas id="particles">
     Particles connect with lines when close
  ────────────────────────────────── */
  const canvas = document.getElementById("particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 70; i++) {
      particles.push({
        x:  Math.random() * w,
        y:  Math.random() * h,
        r:  Math.random() * 1.8 + 0.6,
        dx: (Math.random() - 0.5) * 0.7,
        dy: (Math.random() - 0.5) * 0.7
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(69,231,255,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth   = 0.6;
            ctx.stroke();
          }
        }
      }

      // Dots
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

      requestAnimationFrame(draw);
    }
    draw();
  }


  /* ──────────────────────────────────
     2. SCROLL REVEAL
     Sections & cards fade in on scroll
     Unobserves after first trigger
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
  }, { threshold: 0.12 });

  document.querySelectorAll("section, .card, .result-box, .t-card").forEach(el => {
    el.classList.add("hidden");
    revealObserver.observe(el);
  });


  /* ──────────────────────────────────
     3. NAVBAR SCROLL HIDE (mobile only)
     Hides on scroll down, shows on scroll up
  ────────────────────────────────── */
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      if (window.innerWidth > 768) return;
      const current = window.scrollY;
      if (current > lastScroll && current > 80) {
        navbar.style.transform  = "translateY(-100%)";
        navbar.style.transition = "transform 0.3s ease";
      } else {
        navbar.style.transform = "translateY(0)";
      }
      lastScroll = current;
    });
  }


  /* ──────────────────────────────────
     4. ANIMATED STAT COUNTERS
     .count elements (index, about)
     .rcount elements (results page)
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
      animateCounter(el, +el.dataset.target, el.dataset.suffix || "");
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".count, .rcount").forEach(c => counterObserver.observe(c));


  /* ──────────────────────────────────
     5. HAMBURGER MENU
     Works on all pages automatically
  ────────────────────────────────── */
  const menuBtn  = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      menuBtn.classList.toggle("open");
      navLinks.classList.toggle("open");
      document.body.style.overflow =
        navLinks.classList.contains("open") ? "hidden" : "";
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menuBtn.classList.remove("open");
        navLinks.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }


  /* ──────────────────────────────────
     6. CONTACT FORM
     Shows inline success message
     No browser alert()
  ────────────────────────────────── */
  const contactForm  = document.getElementById("contactForm");
  const formSuccess  = document.getElementById("formSuccess");

  if (contactForm && formSuccess) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      contactForm.style.display = "none";
      formSuccess.style.display = "block";
    });
  }

}); // end DOMContentLoaded
