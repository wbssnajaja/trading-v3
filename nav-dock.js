/**
 * TradeFi Navigation Dock v1.1
 * 修复版：自动适配页面间距，解决图标重叠冲突
 */
(function() {
  // 1. 页面配置
  var PAGES = [
    { id: 'trading',     label: '交易系统',   icon: '📊', href: './index.html' },
    { id: 'chronicle',   label: '编年史',     icon: '◆',  href: './TradeFiCalendar.html' },
    { id: 'fundamental', label: '基本面',     icon: '📈', href: './fundamental.html' }
  ];

  // 2. 自动给页面底部留出空间，防止遮挡按钮
  // 使用 paddingBottom 确保页面内容可以滚动到 Dock 之上
  var adjustBody = function() {
    var footerSpacing = '100px'; // 预留 100 像素
    document.body.style.paddingBottom = 'calc(' + footerSpacing + ' + env(safe-area-inset-bottom))';
  };
  
  if (document.readyState === 'complete') { adjustBody(); } 
  else { window.addEventListener('load', adjustBody); }

  // 3. 当前页面检测
  var path = location.pathname.toLowerCase();
  var current = 'trading';
  if (path.indexOf('calendar') !== -1 || path.indexOf('chronicle') !== -1) current = 'chronicle';
  else if (path.indexOf('fundamental') !== -1) current = 'fundamental';
  else if (path.indexOf('index') !== -1 || path.endsWith('/')) current = 'trading';

  // 4. 注入样式 (优化了 z-index 和悬浮感)
  var style = document.createElement('style');
  style.textContent = [
    '#tradefi-dock { ' +
      'position: fixed; ' +
      'bottom: 12px; ' + // 距离底部稍微悬浮，更好看且避开系统条
      'left: 0; right: 0; ' +
      'z-index: 99999; ' + // 极高层级，确保在所有弹窗之上
      'display: flex; ' +
      'justify-content: center; ' +
      'pointer-events: none; ' +
      'padding-bottom: env(safe-area-inset-bottom); ' +
    '}',
    '#tradefi-dock .dk { ' +
      'display: flex; ' +
      'gap: 4px; ' +
      'padding: 6px; ' +
      'background: rgba(18, 18, 26, 0.88); ' +
      'backdrop-filter: blur(20px); ' +
      '-webkit-backdrop-filter: blur(20px); ' +
      'border: 1px solid rgba(255, 255, 255, 0.12); ' +
      'border-radius: 20px; ' +
      'pointer-events: auto; ' + // 只有 Dock 区域响应点击
      'box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); ' +
    '}',
    '#tradefi-dock a { ' +
      'display: flex; ' +
      'flex-direction: column; ' +
      'align-items: center; ' +
      'gap: 2px; ' +
      'padding: 8px 16px; ' +
      'border-radius: 14px; ' +
      'text-decoration: none; ' +
      'color: #64748b; ' +
      'font-size: 11px; ' +
      'font-family: system-ui, -apple-system, sans-serif; ' +
      'transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); ' +
      'min-width: 68px; ' +
    '}',
    '#tradefi-dock a .ic { font-size: 20px; line-height: 1.2; }',
    '#tradefi-dock a:active { transform: scale(0.9); }', // 点击反馈
    '#tradefi-dock a.active { ' +
      'color: #f59e0b; ' +
      'background: rgba(245, 158, 11, 0.12); ' +
    '}',
    '#tradefi-dock a.active .ic { ' +
      'filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.5)); ' +
    '}',
    '@media (max-width: 380px) { ' +
      '#tradefi-dock a { padding: 6px 12px; min-width: 60px; font-size: 10px; } ' +
      '#tradefi-dock a .ic { font-size: 18px; } ' +
    '}'
  ].join('\n');
  document.head.appendChild(style);

  // 5. 生成 HTML
  var dock = document.createElement('div');
  dock.id = 'tradefi-dock';
  var html = '<div class="dk">';
  PAGES.forEach(function(p) {
    var activeClass = (p.id === current) ? 'active' : '';
    html += '<a href="' + p.href + '" class="' + activeClass + '">' +
            '<span class="ic">' + p.icon + '</span>' +
            '<span>' + p.label + '</span>' +
            '</a>';
  });
  html += '</div>';
  dock.innerHTML = html;

  // 6. 确保注入到 body
  if (document.body) {
    document.body.appendChild(dock);
  } else {
    window.addEventListener('DOMContentLoaded', function() {
      document.body.appendChild(dock);
    });
  }
})();
