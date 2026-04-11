// TYPE TEXT
const texts = ["Get Clients 💰","Go Viral 🚀","Dominate 🔥"];
let i=0,j=0,cur="",del=false;

function type(){
cur=texts[i];
document.getElementById("typeText").innerHTML=cur.substring(0,j);

if(!del && j++===cur.length){
del=true; setTimeout(type,1000); return;
}
if(del && j--===0){
del=false; i=(i+1)%texts.length;
}
setTimeout(type,del?50:100);
}
type();

// PARTICLES
const canvas=document.getElementById("bg");
const ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let particles=[];

for(let i=0;i<150;i++){
particles.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2,
speedX:(Math.random()-0.5),
speedY:(Math.random()-0.5)
});
}

let mouse={x:0,y:0};

window.addEventListener("mousemove",e=>{
mouse.x=e.x;
mouse.y=e.y;
});

function animate(){
ctx.clearRect(0,0,canvas.width,canvas.height);

particles.forEach(p=>{
p.x+=p.speedX+(mouse.x-canvas.width/2)/6000;
p.y+=p.speedY+(mouse.y-canvas.height/2)/6000;

if(p.x<0||p.x>canvas.width) p.speedX*=-1;
if(p.y<0||p.y>canvas.height) p.speedY*=-1;

ctx.fillStyle="#00f2ff";
ctx.fillRect(p.x,p.y,p.size,p.size);
});

requestAnimationFrame(animate);
}

animate();
