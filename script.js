// Loader
window.onload=()=>document.querySelector(".loader").style.display="none";

// Cursor
const cursor=document.querySelector(".cursor");
document.addEventListener("mousemove",(e)=>{
cursor.style.top=e.clientY+"px";
cursor.style.left=e.clientX+"px";
});

// Scroll animation
const observer=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add("show");
}
});
});
document.querySelectorAll(".hidden").forEach(el=>observer.observe(el));

// Particles
const canvas=document.getElementById("bg");
const ctx=canvas.getContext("2d");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let particles=[];
for(let i=0;i<80;i++){
particles.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
r:Math.random()*2
});
}

function draw(){
ctx.clearRect(0,0,canvas.width,canvas.height);
particles.forEach(p=>{
ctx.beginPath();
ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
ctx.fillStyle="#00f2ff";
ctx.fill();
p.y+=0.3;
if(p.y>canvas.height) p.y=0;
});
requestAnimationFrame(draw);
}
draw();