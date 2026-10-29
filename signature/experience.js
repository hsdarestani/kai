/* KAI SIGNATURE — cinematic spatial experience, native browser APIs only */
(()=>{'use strict';
const doc=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
doc.classList.add('js-experience');
/* Opening cinematic: never block the site if motion isn't supported. */
const opening=document.getElementById('kai-opening'),opCount=document.getElementById('opening-counter');
if(opening){
 if(reduce){opening.classList.add('done');opening.setAttribute('aria-hidden','true')}
 else{
 const start=performance.now();function count(t){const v=Math.min(100,Math.round((t-start)/11));if(opCount)opCount.textContent=String(v).padStart(3,'0');if(v<100)requestAnimationFrame(count)}requestAnimationFrame(count);
 setTimeout(()=>{opening.classList.add('done');opening.setAttribute('aria-hidden','true')},1270);
 setTimeout(()=>{opening.style.display='none'},2400);
 }
}
/* Scroll narrative: a sticky 3-act cinematic sequence, controlled by actual scroll progress */
const film=document.getElementById('kai-film'),filmWord=document.getElementById('film-word'),
filmText=document.getElementById('film-text'),filmChapter=document.getElementById('film-chapter'),
filmCounter=document.getElementById('film-current'),filmImgs=[...document.querySelectorAll('.film-layer img')],
filmBars=[...document.querySelectorAll('.film-progress span')],filmKicker=document.getElementById('film-kicker');
const chapters=[
 {headline:'ERHALTEN.',copy:'Ein gepflegter Raum ist kein Zufall. Reinigung und Objektpflege halten Gebäude bereit für den nächsten Tag.',tag:'01 / REINIGUNG'},
 {headline:'VERÄNDERN.',copy:'Aus bestehenden Flächen entsteht neues Potenzial. Sanierung, Ausbau und Oberflächen mit Blick auf das Detail.',tag:'02 / SANIERUNG'},
 {headline:'WEITERDENKEN.',copy:'Zwei Kompetenzbereiche. Ein Ansprechpartner. Für Räume, die heute funktionieren und morgen bestehen.',tag:'03 / KAI'}
];
let currentAct=0,filmPending=false,changing=null;
function setAct(index){if(index===currentAct)return;currentAct=index;filmImgs.forEach((img,i)=>img.classList.toggle('active',i===index));
if(!filmWord)return;
filmWord.classList.add('wipe');filmText?.classList.add('wipe');
clearTimeout(changing);
changing=setTimeout(()=>{filmWord.textContent=chapters[index].headline;filmText.textContent=chapters[index].copy;filmChapter.textContent='0'+(index+1);filmCounter.textContent='0'+(index+1);filmKicker.textContent=chapters[index].tag;filmWord.classList.remove('wipe');filmText?.classList.remove('wipe')},reduce?0:210);
}
function updateFilm(){
 filmPending=false;if(!film)return;
 const rect=film.getBoundingClientRect(),range=Math.max(1,rect.height-innerHeight),progress=Math.max(0,Math.min(1,-rect.top/range));
 const i=Math.min(2,Math.floor(progress*3));
 setAct(i);
 filmBars.forEach((el,j)=>el.style.setProperty('--fill',Math.max(0,Math.min(1,(progress*3-j))).toFixed(4)));
 const img=filmImgs[i];if(img&&!reduce){img.style.transform='scale('+(1.035+((progress*3)%1)*.055)+')'}
 const bar=document.querySelector('.motion-scroll');if(bar){const root=document.documentElement;bar.style.width=Math.round(100*scrollY/Math.max(1,root.scrollHeight-innerHeight))+'%'}
 const heroImg=document.querySelector('.hero-photo img');
 if(heroImg&&!reduce&&scrollY<innerHeight*1.5){heroImg.style.transform='translate3d(0,'+Math.min(scrollY*.16,130)+'px,0)'}
}
function onScroll(){if(!filmPending){filmPending=true;requestAnimationFrame(updateFilm)}}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);updateFilm();
if(film)film.addEventListener('pointermove',e=>{const r=film.getBoundingClientRect();film.style.setProperty('--fx',((e.clientX-r.left)/r.width*100)+'%');film.style.setProperty('--fy',((e.clientY-r.top)/r.height*100)+'%')},{passive:true});
/* Color / atmosphere reveal — one source photo, explicitly not a customer before/after. */
const split=document.getElementById('kai-split'),range=document.getElementById('split-range'),slider=document.getElementById('split-overlay-slider');
if(split&&range){const apply=value=>{const val=Math.min(100,Math.max(0,Number(value)||0));split.style.setProperty('--split',val+'%');range.value=val;if(slider)slider.value=val};apply(55);range.addEventListener('input',()=>apply(range.value));slider?.addEventListener('input',()=>apply(slider.value));
let dragging=false;
function move(e){if(!dragging)return;const r=split.getBoundingClientRect();apply(Math.round((e.clientX-r.left)/r.width*100))}
split.addEventListener('pointerdown',e=>{if(e.target.closest('a,button,input'))return;dragging=true;split.setPointerCapture?.(e.pointerId);move(e)});
split.addEventListener('pointermove',move);
split.addEventListener('pointerup',()=>dragging=false);split.addEventListener('pointercancel',()=>dragging=false);
}
/* Complement existing mode switch with kinetic media transitions. */
const show=document.querySelector('.show-main');document.querySelectorAll('.mode-btn').forEach(b=>b.addEventListener('click',()=>{show?.classList.add('is-switching');setTimeout(()=>show?.classList.remove('is-switching'),440)}));
/* Optional desktop pointer enhancements that never alter tap / keyboard behavior. */
if(matchMedia('(pointer:fine)').matches&&!reduce){
 const halo=document.createElement('div');halo.className='halo';halo.setAttribute('aria-hidden','true');document.body.appendChild(halo);
 let x=-80,y=-80,tx=-80,ty=-80,visible=false;
 addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;visible=true;halo.style.opacity='1';doc.style.setProperty('--mx',((e.clientX/innerWidth)*100).toFixed(1)+'%');doc.style.setProperty('--my',((e.clientY/innerHeight)*100).toFixed(1)+'%')},{passive:true});
 addEventListener('pointerout',e=>{if(!e.relatedTarget){halo.style.opacity='0';visible=false}},{passive:true});
 document.querySelectorAll('a,button,.editorial-card').forEach(el=>{el.addEventListener('mouseenter',()=>halo.classList.add('active'));el.addEventListener('mouseleave',()=>halo.classList.remove('active'))});
 (function loop(){if(visible){x+=(tx-x)*.18;y+=(ty-y)*.18;halo.style.transform='translate3d('+(x-19.5)+'px,'+(y-19.5)+'px,0)'}requestAnimationFrame(loop)})();
 document.querySelectorAll('.magnetic').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform='translate('+(e.clientX-(r.left+r.width/2))*.1+'px,'+(e.clientY-(r.top+r.height/2))*.13+'px)'});el.addEventListener('pointerleave',()=>el.style.transform='')});
}
/* Purpose-built 3D architectural wireframe: genuine perspective projection, no stock video. */
const canvas=document.getElementById('spatial-canvas');
if(canvas&&canvas.getContext){
 const ctx=canvas.getContext('2d',{alpha:true});let w=0,h=0,dpr=1,mouseX=0,mouseY=0,inView=true,frame=0,last=0;
 function resize(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,1.6);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
 resize();new ResizeObserver(resize).observe(canvas);
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>inView=entries[0].isIntersecting,{threshold:.03}).observe(canvas);
 const hero=document.querySelector('.hero');
 hero?.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();mouseX=(e.clientX-r.left)/r.width-.5;mouseY=(e.clientY-r.top)/r.height-.5},{passive:true});
 const cubeEdges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
 const box=(x,y,z,sx,sy,sz)=>[[x,y,z],[x+sx,y,z],[x+sx,y,z+sz],[x,y,z+sz],[x,y+sy,z],[x+sx,y+sy,z],[x+sx,y+sy,z+sz],[x,y+sy,z+sz]];
 function draw(time){requestAnimationFrame(draw);if(reduce||!inView||document.hidden||w<5||time-last<24)return;last=time;frame=time*.00015;
 ctx.clearRect(0,0,w,h);
 const a=.28+Math.sin(frame)*.06+mouseX*.25,b=-.3+mouseY*.19,cos=Math.cos(a),sin=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b);
 function project(p){let [x,y,z]=p;x-=.25;z-=.3;const xx=x*cos-z*sin,zz=x*sin+z*cos,yy=y*cb-zz*sb,depth=y*sb+zz*cb+10;const scale=Math.min(w,h)*1.25/depth;return [w*.54+xx*scale,h*.61-yy*scale,depth]}
 function line(p,q,alpha=1,bright=false){const a=project(p),b=project(q);ctx.strokeStyle=bright?'rgba(167,222,255,'+(.55*alpha)+')':'rgba(130,192,237,'+(.28*alpha)+')';ctx.lineWidth=bright?1.3:.7;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke()}
 for(let i=-9;i<=9;i++){line([i*.54,-1.7,-5],[i*.54,-1.7,5],.32);line([-5,-1.7,i*.54],[5,-1.7,i*.54],.32)}
 const buildings=[[-2.2,-1.7,-1.1,1.8,3.8,1.55],[.5,-1.7,-.5,1.4,5.5,1.5],[2.05,-1.7,-1.75,1.55,2.75,1.55]];
 buildings.forEach((b,idx)=>{const corners=box(...b);
 cubeEdges.forEach(([j,k],edge)=>line(corners[j],corners[k],.85,edge<4||edge>7));
 const [x,y,z,sx,sy,sz]=b;
 const levels=Math.round(sy/.66);
 for(let n=1;n<levels;n++){const yy=y+sy*n/levels;for(const k of [[x,yy,z],[x+sx,yy,z],[x,yy,z+sz],[x+sx,yy,z+sz]]){ /* grid guides */ }
 line([x,yy,z],[x+sx,yy,z],.4);line([x+sx,yy,z],[x+sx,yy,z+sz],.4);line([x,yy,z+sz],[x+sx,yy,z+sz],.2)}
 for(let n=1;n<4;n++){const xx=x+sx*n/4;line([xx,y,z],[xx,y+sy,z],.38);line([xx,y,z+sz],[xx,y+sy,z+sz],.2)}
 const roof=project([x+sx*.5,y+sy,z+sz*.5]);ctx.fillStyle='rgba(141,212,255,.9)';ctx.beginPath();ctx.arc(roof[0],roof[1],idx===1?3.5:2,0,Math.PI*2);ctx.fill();
 });
 const sweep=(time*.015)%w;
 const grad=ctx.createLinearGradient(sweep-70,0,sweep+70,0);grad.addColorStop(0,'rgba(123,205,255,0)');grad.addColorStop(.5,'rgba(123,205,255,.10)');grad.addColorStop(1,'rgba(123,205,255,0)');ctx.fillStyle=grad;ctx.fillRect(sweep-70,0,140,h);
 }
 if(!reduce)requestAnimationFrame(draw);
}
/* Reveal newly introduced editorial sections. */
const newEls=document.querySelectorAll('[data-film-reveal]');
if(reduce||!('IntersectionObserver' in window)){newEls.forEach(el=>el.classList.add('in'))}
else{const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -60px 0px',threshold:.1});newEls.forEach(el=>io.observe(el))}
})();