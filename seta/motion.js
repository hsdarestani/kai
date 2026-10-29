/* KAI classic — motion layer with accessibility and no external dependencies */
(()=>{'use strict';
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('motion-ready');if(reduce)document.documentElement.classList.add('reduce-motion');
document.querySelectorAll('.about-grid > *, .benefit, .service, .step, .gallery article, .motion-gallery-head > *, .motion-gallery figure, .section-head > *, .contact-layout > *, .band .wrap > *').forEach(el=>el.setAttribute('data-reveal','rise'));
const ready=()=>document.querySelectorAll('[data-reveal]').forEach((el,i)=>{
 if(reduce||!('IntersectionObserver' in window)){el.classList.add('shown');return}
 const io=window.__kaiReveal||(window.__kaiReveal=new IntersectionObserver(entries=>{
 entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('shown');window.__kaiReveal.unobserve(e.target)}});
 },{threshold:.11,rootMargin:'0px 0px -25px 0px'}));
 el.style.transitionDelay=Math.min(i%4,3)*65+'ms';io.observe(el)
});
ready();
/* Hero background slideshow: motion is opt-out, controls stay functional. */
const hero=document.querySelector('.hero'),frames=Array.from(document.querySelectorAll('.hero-frame')),dots=Array.from(document.querySelectorAll('.hero-dot'));
const tag=document.querySelector('.hero-slidetext');
const labels=['Reinigung und Objektpflege','Sanierung und Innenausbau','Glasreinigung und Pflege'];
let current=0,automatic=null;
function showSlide(index){if(!frames.length)return;current=(index+frames.length)%frames.length;frames.forEach((f,i)=>{f.classList.toggle('is-active',i===current);f.setAttribute('aria-hidden',String(i!==current))});dots.forEach((d,i)=>{d.setAttribute('aria-current',String(i===current));d.setAttribute('aria-label','Bild '+(i+1)+' von '+frames.length+': '+labels[i])});if(tag)tag.textContent=labels[current];}
function stop(){if(automatic){clearInterval(automatic);automatic=null}}
function start(){if(reduce||automatic||frames.length<2||document.hidden)return;automatic=setInterval(()=>showSlide(current+1),5900)}
dots.forEach((dot,i)=>dot.addEventListener('click',()=>{stop();showSlide(i)}));
hero?.addEventListener('mouseenter',stop);hero?.addEventListener('mouseleave',start);
hero?.addEventListener('focusin',stop);hero?.addEventListener('focusout',e=>{if(!hero.contains(e.relatedTarget))start()});
document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
showSlide(0);start();
/* Staggered section and honest, factual counters only. */
const counterEls=[...document.querySelectorAll('[data-count]')];
function animateCounter(el){const target=+el.dataset.count;const start=performance.now();const duration=1100;
if(reduce){el.textContent=String(target).padStart(2,'0');return}
function tick(now){const t=Math.min(1,(now-start)/duration);const eased=1-Math.pow(1-t,3);el.textContent=String(Math.round(target*eased)).padStart(2,'0');if(t<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)}
if('IntersectionObserver' in window){const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;animateCounter(e.target);obs.unobserve(e.target)}),{threshold:.5});counterEls.forEach(x=>obs.observe(x))}else{counterEls.forEach(animateCounter)}
/* Scroll snap carousel with keyboard accessible previous / next actions. */
const gallery=document.getElementById('motion-gallery');
document.querySelectorAll('[data-gallery-dir]').forEach(b=>b.addEventListener('click',()=>{if(!gallery)return;const item=gallery.querySelector('figure');if(!item)return;const width=item.getBoundingClientRect().width+22;gallery.scrollBy({left:+b.dataset.galleryDir*width,behavior:reduce?'instant':'smooth'})}));
/* A responsive nav closes on Escape, and focus visible remains independent of motion. */
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;const nav=document.querySelector('.links');const button=document.querySelector('.hamburger');if(nav?.classList.contains('open')){nav.classList.remove('open');button.setAttribute('aria-expanded','false');button.focus()}});
})();