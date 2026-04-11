// Lightweight loading effect
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const progress = document.getElementById("loaderProgress");
  let loaded = 0;
  const timer = setInterval(() => {
    loaded += 3;
    if (progress) progress.style.width = loaded + "%";
    if (loaded >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        if (loader) loader.classList.add("hide");
      }, 250);
    }
  }, 18);
});
// Mobile navigation toggle
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
  });
  document.querySelectorAll(".nav-menu a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });
}
// Smooth reveal on scroll
const revealElements = document.querySelectorAll(".reveal");
function revealOnScroll() {
  const windowHeight = window.innerHeight;
  revealElements.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 90) {
      el.classList.add("visible");
    }
  });
}
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
// Typing effect for hero headline
const typedText = document.getElementById("typedText");
if (typedText) {
  const words = ["More Clients", "Better Leads", "Higher Sales", "Real Growth"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  function typeLoop() {
    const currentWord = words[wordIndex];
    const text = isDeleting
      ? currentWord.substring(0, charIndex--)
      : currentWord.substring(0, charIndex++);
    typedText.textContent = text;
    if (!isDeleting && charIndex === currentWord.length + 1) {
      isDeleting = true;
      setTimeout(typeLoop, 1200);
      return;
    }
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
    setTimeout(typeLoop, isDeleting ? 55 : 95);
  }
  typeLoop();
}
// Active navigation link on scroll
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");
function setActiveNav() {
  let currentSection = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}
window.addEventListener("scroll", setActiveNav);
window.addEventListener("load", setActiveNav);
// Contact form handling
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Thanks! Your message has been submitted. You can also message on WhatsApp for a faster reply.");
    contactForm.reset();
  });
}
