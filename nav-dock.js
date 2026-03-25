/**
 * TradeFi Nav Sidebar v2.0
 * 左上角汉堡按钮 → 展开侧边栏切换页面
 */
(function() {
  var PAGES = [
    { id: 'trading',     label: '交易系统',       icon: '📊', href: './index.html' },
    { id: 'chronicle',   label: '财经日历',       icon: '◆',  href: './TradeFiCalendar.html' },
    { id: 'fundamental', label: '基本面追踪器',   icon: '📈', href: './fundamental.html' }
  ];

  var path = location.pathname.toLowerCase();
  var current = 'trading';
  if (path.indexOf('tradeficalendar') !== -1 || path.indexOf('calendar') !== -1) current = 'chronicle';
  else if (path.indexOf('fundamental') !== -1) current = 'fundamental';

  var currentLabel = '';
  for (var i = 0; i < PAGES.length; i++) { if (PAGES[i].id === current) currentLabel = PAGES[i].label; }

  var style = document.createElement('style');
  style.textContent = [
    '#tfi-nav-btn{position:fixed;top:12px;left:12px;z-index:9999;display:flex;align-items:center;gap:6px;padding:6px 12px 6px 8px;border-radius:8px;background:rgba(10,15,26,.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.08);cursor:pointer;user-select:none;transition:all .2s}',
    '#tfi-nav-btn:hover{background:rgba(10,15,26,.95);border-color:rgba(245,158,11,.3)}',
    '#tfi-nav-btn .ham{display:flex;flex-direction:column;gap:3px;width:14px}',
    '#tfi-nav-btn .ham span{display:block;height:1.5px;background:#64748b;border-radius:1px;transition:all .2s}',
    '#tfi-nav-btn:hover .ham span{background:#f59e0b}',
    '#tfi-nav-btn .lbl{font-size:11px;color:#94a3b8;font-family:"Noto Sans SC",system-ui,sans-serif;letter-spacing:.5px}',
    '#tfi-sidebar{position:fixed;top:0;left:0;bottom:0;z-index:9998;width:220px;background:rgba(8,12,22,.97);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-right:1px solid rgba(255,255,255,.06);transform:translateX(-100%);transition:transform .25s ease;display:flex;flex-direction:column;padding:60px 0 20px}',
    '#tfi-sidebar.open{transform:translateX(0)}',
    '#tfi-overlay{position:fixed;inset:0;z-index:9997;background:rgba(0,0,0,.4);opacity:0;pointer-events:none;transition:opacity .25s}',
    '#tfi-overlay.open{opacity:1;pointer-events:auto}',
    '#tfi-sidebar a{display:flex;align-items:center;gap:10px;padding:12px 20px;text-decoration:none;color:#64748b;font-size:13px;font-family:"Noto Sans SC",system-ui,sans-serif;transition:all .15s;border-left:3px solid transparent}',
    '#tfi-sidebar a:hover{color:#e2e8f0;background:rgba(255,255,255,.03)}',
    '#tfi-sidebar a.active{color:#f59e0b;background:rgba(245,158,11,.06);border-left-color:#f59e0b}',
    '#tfi-sidebar a .ic{font-size:16px;width:22px;text-align:center}',
    '#tfi-sidebar .foot{margin-top:auto;padding:16px 20px;font-size:9px;color:#1e293b;font-family:"JetBrains Mono",monospace;letter-spacing:.5px}',
  ].join('\n');
  document.head.appendChild(style);

  var overlay = document.createElement('div');
  overlay.id = 'tfi-overlay';
  document.body.appendChild(overlay);

  var sidebar = document.createElement('div');
  sidebar.id = 'tfi-sidebar';
  var html = '';
  for (var j = 0; j < PAGES.length; j++) {
    var p = PAGES[j];
    html += '<a href="' + p.href + '" class="' + (p.id === current ? 'active' : '') + '">';
    html += '<span class="ic">' + p.icon + '</span><span>' + p.label + '</span></a>';
  }
  sidebar.innerHTML = html + '<div class="foot">TradeFi Suite</div>';
  document.body.appendChild(sidebar);

  var btn = document.createElement('div');
  btn.id = 'tfi-nav-btn';
  btn.innerHTML = '<div class="ham"><span></span><span></span><span></span></div><span class="lbl">' + currentLabel + '</span>';
  document.body.appendChild(btn);

  var isOpen = false;
  function toggle() {
    isOpen = !isOpen;
    sidebar.classList.toggle('open', isOpen);
    overlay.classList.toggle('open', isOpen);
  }
  btn.addEventListener('click', function(e) { e.stopPropagation(); toggle(); });
  overlay.addEventListener('click', function() { if (isOpen) toggle(); });
})();