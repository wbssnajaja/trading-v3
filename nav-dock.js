/**
 * TradeFi Navigation Dock v2.0
 * 工程级版本：自适应高度 + 防重复注入 + 无布局抖动
 */
(function () {
  // 🛑 防止重复注入
  if (document.getElementById('tradefi-dock')) return;

  // 1️⃣ 页面配置
  var PAGES = [
    { id: 'trading', label: '交易系统', icon: '📊', href: './index.html' },
    { id: 'chronicle', label: '编年史', icon: '◆', href: './TradeFiCalendar.html' },
    { id: 'fundamental', label: '基本面', icon: '📈', href: './fundamental.html' }
  ];

  // 2️⃣ 当前页面判断（更稳）
  var path = location.pathname.toLowerCase();
  var current = PAGES.find(p => path.includes(p.id))?.id || 'trading';

  // 3️⃣ 注入 CSS（先注入避免闪动）
  var style = document.createElement('style');
  style.textContent = `
    #tradefi-dock {
      position: fixed;
      bottom: 12px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      z-index: 99999;
      pointer-events: none;
    }

    #tradefi-dock .dk {
      display: flex;
      gap: 4px;
      padding: 6px;
      background: rgba(18,18,26,0.88);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.12);
      pointer-events: auto;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    }

    #tradefi-dock a {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 8px 16px;
      border-radius: 14px;
      text-decoration: none;
      color: #64748b;
      font-size: 11px;
      min-width: 68px;
      transition: all .2s ease;
    }

    #tradefi-dock a .ic {
      font-size: 20px;
    }

    #tradefi-dock a.active {
      color: #f59e0b;
      background: rgba(245,158,11,0.12);
    }

    #tradefi-dock a:active {
      transform: scale(0.9);
    }
  `;
  document.head.appendChild(style);

  // 4️⃣ 创建 Dock
  var dock = document.createElement('div');
  dock.id = 'tradefi-dock';

  var html = '<div class="dk">';
  PAGES.forEach(function (p) {
    html += `
      <a href="${p.href}" class="${p.id === current ? 'active' : ''}">
        <span class="ic">${p.icon}</span>
        <span>${p.label}</span>
      </a>
    `;
  });
  html += '</div>';

  dock.innerHTML = html;

  // 5️⃣ 插入 DOM（尽早）
  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(dock);

    // 6️⃣ ✅ 动态计算 Dock 高度（关键升级）
    requestAnimationFrame(function () {
      var height = dock.offsetHeight;

      document.body.style.paddingBottom =
        `calc(${height + 16}px + env(safe-area-inset-bottom))`;
    });
  });

})();
