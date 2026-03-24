/**
 * TradeFi Navigation Dock v1.0
 * 在任意页面底部注入浮动导航栏，串联所有工具
 * 用法：在每个 HTML 末尾加 <script src="nav-dock.js"></script>
 */
(function() {
  var PAGES = [
    { id: 'trading',     label: '交易系统',   icon: '📊', href: './index.html' },
    { id: 'chronicle',   label: '编年史',     icon: '◆',  href: './TradeFiCalendar.html' },
    { id: 'fundamental', label: '基本面',     icon: '📈', href: './fundamental.html' }
  ];

  // Detect current page
  var path = location.pathname.toLowerCase();
  var current = 'trading';
  if (path.indexOf('tradeficalendar') !== -1 || path.indexOf('calendar') !== -1) current = 'chronicle';
  else if (path.indexOf('fundamental') !== -1) current = 'fundamental';
  else if (path.indexOf('index') !== -1 || path.endsWith('/')) current = 'trading';

  // Inject CSS
  var style = document.createElement('style');
  style.textContent = [
    '#tradefi-dock{position:fixed;bottom:0;left:0;right:0;z-index:9998;display:flex;justify-content:center;padding:0 0 env(safe-area-inset-bottom,0);pointer-events:none}',
    '#tradefi-dock .dk{display:flex;gap:2px;padding:4px;margin:8px;border-radius:14px;background:rgba(10,15,26,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.08);pointer-events:auto;box-shadow:0 4px 24px rgba(0,0,0,.5)}',
    '#tradefi-dock a{display:flex;flex-direction:column;align-items:center;gap:1px;padding:8px 18px;border-radius:10px;text-decoration:none;color:#64748b;font-size:10px;font-family:"Noto Sans SC",system-ui,sans-serif;transition:all .2s;min-width:64px}',
    '#tradefi-dock a .ic{font-size:18px;line-height:1.2}',
    '#tradefi-dock a:hover{color:#e2e8f0;background:rgba(255,255,255,.06)}',
    '#tradefi-dock a.active{color:#f59e0b;background:rgba(245,158,11,.1)}',
    '#tradefi-dock a.active .ic{filter:drop-shadow(0 0 4px rgba(245,158,11,.4))}',
    '@media(max-width:400px){#tradefi-dock a{padding:6px 14px;min-width:56px}}'
  ].join('\n');
  document.head.appendChild(style);

  // Inject HTML
  var dock = document.createElement('div');
  dock.id = 'tradefi-dock';
  var inner = '<div class="dk">';
  for (var i = 0; i < PAGES.length; i++) {
    var p = PAGES[i];
    inner += '<a href="' + p.href + '" class="' + (p.id === current ? 'active' : '') + '">';
    inner += '<span class="ic">' + p.icon + '</span>';
    inner += '<span>' + p.label + '</span></a>';
  }
  inner += '</div>';
  dock.innerHTML = inner;
  document.body.appendChild(dock);

  // Add bottom padding to body so content isn't hidden behind dock
  var pad = document.createElement('div');
  pad.style.height = '72px';
  document.body.appendChild(pad);
})();
