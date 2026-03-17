  <script>
    document.addEventListener('DOMContentLoaded', function () {
      // 載入共用導覽列
      fetch('nav.html')
        .then(response => response.text())
        .then(data => {
          document.getElementById('nav-placeholder').innerHTML = data;
          // 在導覽列插入後，重新綁定事件與初始化
          initNav();
        })
        .catch(err => {
          console.error('無法載入導覽列:', err);
          // 錯誤時的備用顯示
          document.getElementById('nav-placeholder').innerHTML = 
            '<nav style="background:var(--moss);color:white;padding:0 4vw;height:72px;display:flex;align-items:center;">' +
            '<span style="font-family:Noto Serif TC,serif;font-weight:900;">⚠️ 導覽列載入失敗，請確認 nav.html 是否存在</span>' +
            '</nav>';
        });

      function initNav() {
        // hamburger 事件
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
        // 行動選單的展開折疊
        if (menu) {
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
        }
        // 滾動效果
        window.addEventListener('scroll', function () {
          var nav = document.getElementById('mainNav');
          if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
        });
        // 重新綁定 lucide 圖示
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    });
  </script>
</body>
