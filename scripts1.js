  document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM 載入完成，開始載入導覽列...');
  
  // 載入共用導覽列
  fetch('nav.html')
    .then(response => {
      console.log('導覽列載入回應:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      console.log('導覽列內容長度:', data.length);
      document.getElementById('nav-placeholder').innerHTML = data;
      // 在導覽列插入後，重新綁定事件與初始化
      initNav();
    })
    .catch(err => {
      console.error('無法載入導覽列:', err);
      // 錯誤時的備用顯示
      document.getElementById('nav-placeholder').innerHTML = 
        '<nav style="background:#3d5a38;color:white;padding:0 4vw;height:72px;display:flex;align-items:center;justify-content:center;">' +
        '<span style="font-family:Noto Serif TC,serif;font-weight:900;">⚠️ 導覽列載入失敗，請確認 nav.html 是否存在 (路徑: ' + window.location.pathname + ')</span>' +
        '</nav>';
    });

  function initNav() {
    console.log('初始化導覽列功能...');
    
    // 檢查元素是否存在
    var btn = document.getElementById('hamburger');
    var menu = document.getElementById('mobileMenu');
    var nav = document.getElementById('mainNav');
    
    console.log('漢堡按鈕:', btn ? '存在' : '不存在');
    console.log('手機選單:', menu ? '存在' : '不存在');
    console.log('主導覽列:', nav ? '存在' : '不存在');
    
    // hamburger 事件
    if (btn && menu) {
      btn.addEventListener('click', function () {
        btn.classList.toggle('open');
        menu.classList.toggle('open');
      });
      
      if (menu.querySelectorAll) {
        menu.querySelectorAll('.mobile-link').forEach(function (a) {
          a.addEventListener('click', function () {
            btn.classList.remove('open');
            menu.classList.remove('open');
          });
        });
      }
    }
    
    // 行動選單的展開折疊
    if (menu && menu.querySelectorAll) {
      menu.querySelectorAll('.mobile-parent').forEach(function (parent) {
        parent.addEventListener('click', function () {
          var id = parent.getAttribute('data-target');
          var sub = document.getElementById(id);
          var caretId = 'caret-' + id.replace('sub-', '');
          var caret = document.getElementById(caretId);
          var opening = !sub.classList.contains('open');
          
          menu.querySelectorAll('.mobile-sub').forEach(function (s) { 
            s.classList.remove('open'); 
          });
          menu.querySelectorAll('.mobile-caret').forEach(function (c) { 
            c.classList.remove('open'); 
          });
          
          if (opening) {
            sub.classList.add('open');
            if (caret) caret.classList.add('open');
          }
        });
      });
    }
    
    // 滾動效果
    window.addEventListener('scroll', function () {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
    });
    
    // 重新綁定 lucide 圖示
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
      console.log('Lucide 圖示重新綁定完成');
    }
  }
});
