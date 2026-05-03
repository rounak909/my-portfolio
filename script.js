/* ===================================
   SCRIPT.JS — IMPROVED
=================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ──────────────────────────────────
     1. PARTICLE BACKGROUND
     FIXED: uses existing <canvas id="particles">
     instead of creating a duplicate one.
     IMPROVED: particles now connect with
     lines when close to each other.
  ────────────────────────────────── */
  const canvas = document.getElementById("particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // IMPROVED: slightly fewer, more visible particles
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.6,
        dx: (Math.random() - 0.5) * 0.7,
        dy: (Math.random() - 0.5) * 0.7
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // IMPROVED: draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(69,231,255,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw particles
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
     Cards and sections fade in as
     they enter the viewport.
  ────────────────────────────────── */
  const revealStyle = document.createElement("style");
  revealStyle.innerHTML = `
    .hidden{
      opacity:0;
      transform:translateY(36px);
      transition:opacity .7s ease, transform .7s ease;
    }
    .show{
      opacity:1;
      transform:translateY(0);
    }
  `;
  document.head.appendChild(revealStyle);

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target); // only animate once
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll("section, .card, .result-box, .t-card").forEach(el => {
    el.classList.add("hidden");
    revealObserver.observe(el);
  });


  /* ──────────────────────────────────
     3. NAVBAR — HIDE ON SCROLL DOWN,
        SHOW ON SCROLL UP (mobile only)
  ────────────────────────────────── */
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      if (window.innerWidth > 768) return; // desktop: always visible
      const current = window.scrollY;
      if (current > lastScroll && current > 80) {
        navbar.style.transform = "translateY(-100%)";
        navbar.style.transition = "transform 0.3s ease";
      } else {
        navbar.style.transform = "translateY(0)";
      }
      lastScroll = current;
    });
  }


  /* ──────────────────────────────────
     4. ANIMATED STAT COUNTERS
     Counts up when stats scroll into view.
     Works for both .count (index.html)
     and plain stat h3 values.
  ────────────────────────────────── */
  const counters = document.querySelectorAll(".count");
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.target;
        let count = 0;
        const step = Math.max(1, Math.ceil(target / 50));
        const timer = setInterval(() => {
          count = Math.min(count + step, target);
          el.textContent = count;
          if (count >= target) clearInterval(timer);
        }, 35);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }


  /* ──────────────────────────────────
     5. CONTACT FORM
     IMPROVED: shows inline success message
     instead of browser alert().
     Works with the #contactForm + #formSuccess
     added in contact.html.
  ────────────────────────────────── */
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  if (contactForm && formSuccess) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      contactForm.style.display = "none";
      formSuccess.style.display = "block";
    });
  } else {
    // Fallback for any other forms on the site (no alert — silent prevent)
    document.addEventListener("submit", function (e) {
      if (e.target.tagName === "FORM") {
        e.preventDefault();
      }
    });
  }


  /* ──────────────────────────────────
     6. HAMBURGER MENU
     Works for all pages that include
     #menuBtn and #navLinks.
  ────────────────────────────────── */
  const menuBtn = document.getElementById("menuBtn");
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

}); // end DOMContentLoaded
