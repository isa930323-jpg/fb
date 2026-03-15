async function loadLayout(){

const nav = await fetch("nav.html");
const navHTML = await nav.text();
document.getElementById("nav-placeholder").innerHTML = navHTML;

const footer = await fetch("footer.html");
const footerHTML = await footer.text();
document.getElementById("footer-placeholder").innerHTML = footerHTML;

initNav();

}

function initNav(){

const btn=document.getElementById("hamburger");
const menu=document.getElementById("mobileMenu");

if(btn){
btn.addEventListener("click",()=>{
btn.classList.toggle("open");
menu.classList.toggle("open");
});
}

window.addEventListener("scroll",()=>{
const nav=document.getElementById("mainNav");
if(nav){
nav.classList.toggle("scrolled",window.scrollY>20);
}
});

if(window.lucide){
lucide.createIcons();
}

}

document.addEventListener("DOMContentLoaded",loadLayout);