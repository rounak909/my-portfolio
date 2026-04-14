// Particles Background
document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.createElement("canvas");
  canvas.id = "particles-bg";
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 1,
      dy: (Math.random() - 0.5) * 1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,217,255,0.7)";
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
});

// Canvas Style
const style = document.createElement("style");
style.innerHTML = `
#particles-bg{
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
z-index:-2;
background:transparent;
}
`;
document.head.appendChild(style);

// Scroll Reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll("section, .card, .result-box").forEach(el => {
  el.classList.add("hidden");
  observer.observe(el);
});

// Reveal CSS
const revealStyle = document.createElement("style");
revealStyle.innerHTML = `
.hidden{
opacity:0;
transform:translateY(40px);
transition:all .8s ease;
}
.show{
opacity:1;
transform:translateY(0);
}
`;
document.head.appendChild(revealStyle);

// Contact Form Demo
document.addEventListener("submit", function(e){
  if(e.target.tagName === "FORM"){
    e.preventDefault();
    alert("Thanks! Message received 🚀");
  }
});
