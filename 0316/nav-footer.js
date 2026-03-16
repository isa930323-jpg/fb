document.addEventListener('DOMContentLoaded', function () {

const btn = document.getElementById('hamburger');
const menu = document.getElementById('mobileMenu');

if(btn && menu){

btn.addEventListener('click', function(){

btn.classList.toggle('open');
menu.classList.toggle('open');

});

menu.querySelectorAll('.mobile-link').forEach(function(link){

link.addEventListener('click', function(){

btn.classList.remove('open');
menu.classList.remove('open');

});

});

}

window.addEventListener('scroll', function(){

const nav = document.getElementById('mainNav');

if(nav){
nav.classList.toggle('scrolled', window.scrollY > 20);
}

});

});
