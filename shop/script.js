<script>
document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('hamburger');
  var menu = document.getElementById('mobileMenu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      btn.classList.toggle('open');
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('.mobile-link').forEach(function (a) {
      a.addEventListener('click', function () {
        btn.classList.remove('open');
        menu.classList.remove('open');
      });
    });
  }
  menu.querySelectorAll('.mobile-parent').forEach(function (parent) {
    parent.addEventListener('click', function () {
      var id = parent.getAttribute('data-target');
      var sub = document.getElementById(id);
      var caretId = 'caret-' + id.replace('sub-', '');
      var caret = document.getElementById(caretId);
      var opening = !sub.classList.contains('open');
      menu.querySelectorAll('.mobile-sub').forEach(function (s) { s.classList.remove('open'); });
      menu.querySelectorAll('.mobile-caret').forEach(function (c) { c.classList.remove('open'); });
      if (opening) {
        sub.classList.add('open');
        if (caret) caret.classList.add('open');
      }
    });
  });
  window.addEventListener('scroll', function () {
    var nav = document.getElementById('mainNav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
  });
  var reveals = document.querySelectorAll('.reveal');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  reveals.forEach(function (el) { observer.observe(el); });
  lucide.createIcons();
});
</script>