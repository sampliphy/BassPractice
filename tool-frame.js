'use strict';
// Small bridge shared by otherwise independent HTML tools; works on file:// too.
if (new URLSearchParams(location.search).get('embedded') === '1' && window.parent !== window) {
  document.documentElement.dataset.embedded = 'true';
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = '../shell.css';
  document.head.append(stylesheet);
  const reportHeight = () => window.parent.postMessage({type:'tempo-tool-height',height:document.body.getBoundingClientRect().height}, '*');
  new ResizeObserver(reportHeight).observe(document.body);
  window.addEventListener('load', reportHeight);
  window.addEventListener('message', event => {
    if (event.source !== window.parent || event.data?.type !== 'tempo-tool-active') return;
    if (!event.data.active) document.dispatchEvent(new Event('tempo:deactivate'));
    reportHeight();
  });
}
