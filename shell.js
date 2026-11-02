'use strict';
const tabs = [...document.querySelectorAll('[data-tool]')];
const frames = [...document.querySelectorAll('[data-frame]')];
const heights = new Map();
let activeTool = 'harmonies';
function resizeViewport() {
  document.querySelector('.tool-viewport').style.height = `${heights.get(activeTool) || 1000}px`;
}
function selectTool(name, focus = false) {
  if (!tabs.some(tab => tab.dataset.tool === name)) return;
  activeTool = name;
  document.body.dataset.active = name;
  document.querySelector('.tool-tabs').dataset.active = name;
  for (const tab of tabs) {
    const selected = tab.dataset.tool === name;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    panel.inert = !selected;
    panel.setAttribute('aria-hidden', String(!selected));
    if (selected && focus) tab.focus();
  }
  for (const frame of frames) frame.contentWindow.postMessage({type:'tempo-tool-active',active:frame.dataset.frame === name}, '*');
  resizeViewport();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTool(tab.dataset.tool));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectTool(tabs[next].dataset.tool, true);
  });
});
window.addEventListener('message', event => {
  const frame = frames.find(item => item.contentWindow === event.source);
  if (!frame || event.data?.type !== 'tempo-tool-height') return;
  const height = Number(event.data.height);
  if (!Number.isFinite(height)) return;
  const safeHeight = Math.min(10000, Math.max(300, Math.ceil(height)));
  heights.set(frame.dataset.frame, safeHeight);
  frame.style.height = `${safeHeight}px`;
  if (frame.dataset.frame === activeTool) resizeViewport();
});
frames.forEach(frame => frame.addEventListener('load', () => {
  frame.contentWindow.postMessage({type:'tempo-tool-active',active:frame.dataset.frame === activeTool}, '*');
}));
selectTool(activeTool);
