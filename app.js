document.querySelectorAll("[data-year]").forEach(function(el){
  el.textContent = new Date().getFullYear();
});

var menuButton = document.querySelector(".menu-button");
if(menuButton){
  menuButton.addEventListener("click", function(){
    var opened = document.body.classList.toggle("nav-open");
    menuButton.setAttribute("aria-expanded", opened ? "true" : "false");
  });
  document.querySelectorAll(".main-nav a").forEach(function(link){
    link.addEventListener("click", function(){
      document.body.classList.remove("nav-open");
      menuButton.setAttribute("aria-expanded","false");
    });
  });
}

var header = document.querySelector(".site-header");
var topbarHeight = document.querySelector(".topbar") ? 36 : 0;
function updateHeader(){
  if(!header) return;
  if(window.innerWidth > 760 && window.scrollY > 140){
    header.classList.add("is-sticky");
  }else{
    header.classList.remove("is-sticky");
  }
}
window.addEventListener("scroll", updateHeader, {passive:true});
window.addEventListener("resize", updateHeader);
updateHeader();

var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var nodes = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
if("IntersectionObserver" in window && !reduceMotion){
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, {threshold:.09, rootMargin:"0px 0px -3% 0px"});
  nodes.forEach(function(node,index){
    node.style.transitionDelay = Math.min(index % 4, 3) * 45 + "ms";
    observer.observe(node);
  });
}else{
  nodes.forEach(function(node){ node.classList.add("visible"); });
}

document.querySelectorAll("[data-demo-form]").forEach(function(form){
  form.addEventListener("submit", function(event){
    event.preventDefault();
    if(!form.reportValidity()) return;
    var toast = document.querySelector(".toast");
    if(toast){
      toast.classList.add("show");
      window.setTimeout(function(){ toast.classList.remove("show"); }, 3800);
    }
    form.reset();
  });
});