async function loadComponent(id, file, callback) {
  const container = document.getElementById(id);
  if (!container) return;
  try {
    const response = await fetch(file);
    const html = await response.text();
    container.innerHTML = html;
    if (callback) callback();
    if (window.lucide) lucide.createIcons();
  } catch (error) {
    console.error('Error loading component:', file, error);
  }
}

function initNavBehavior() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  const nav = document.getElementById('mainNav');

  if (btn && menu) {
    btn.addEventListener('click', function() {
      btn.classList.toggle('open');
      menu.classList.toggle('open');
    });

    menu.querySelectorAll('.mobile-link').forEach(function(a) {
      a.addEventListener('click', function() {
        btn.classList.remove('open');
        menu.classList.remove('open');
      });
    });

    menu.querySelectorAll('.mobile-parent').forEach(function(parent) {
      parent.addEventListener('click', function() {
        var id = parent.getAttribute('data-target');
        var sub = document.getElementById(id);
        var caretId = 'caret-' + id.replace('sub-', '');
        var caret = document.getElementById(caretId);
        var opening = !sub.classList.contains('open');

        menu.querySelectorAll('.mobile-sub').forEach(function(s) { s.classList.remove('open'); });
        menu.querySelectorAll('.mobile-caret').forEach(function(c) { c.classList.remove('open'); });

        if (opening) {
          sub.classList.add('open');
          if (caret) caret.classList.add('open');
        }
      });
    });
  }

  window.addEventListener('scroll', function() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

function initRevealAnimation() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(function(r) { observer.observe(r); });
}

document.addEventListener('DOMContentLoaded', function() {
  loadComponent('nav-placeholder', 'nav.html', initNavBehavior);
  loadComponent('footer-placeholder', 'footer.html');
  initRevealAnimation();
});
