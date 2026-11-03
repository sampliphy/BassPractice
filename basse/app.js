'use strict';
const KEYS_FLATS = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
const KEYS_SHARPS = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const EASY_KEYS = ['C','D','E','F','G','A','B','Bb','Eb','Ab'];
const PROG = [
  {name:'Pop', mode:'major', rn:['I','V','vi','IV']},
  {name:'Pop · variante', mode:'major', rn:['I','vi','IV','V']},
  {name:'Trois accords', mode:'major', rn:['I','IV','V']},
  {name:'Turnaround', mode:'major', rn:['ii','V','I']},
  {name:'Mineur naturel', mode:'minor', rn:['i','VI','III','VII']}
];
const pick = values => values[Math.floor(Math.random() * values.length)];
const pretty = key => key.replace('b','♭').replace('#','♯');
function getKeyPool() {
  const acc = document.getElementById('acc').value;
  let pool = acc === 'flats' ? KEYS_FLATS : acc === 'sharps' ? KEYS_SHARPS : [...new Set([...KEYS_FLATS,...KEYS_SHARPS])];
  if (document.getElementById('easy').value === 'on') pool = pool.filter(key => EASY_KEYS.includes(key));
  return pool;
}
function getQuality() {
  const mode = document.getElementById('quality').value;
  return mode === 'both' ? pick(['major','minor']) : mode;
}
function generate() {
  const key = pick(getKeyPool());
  const mode = getQuality();
  const progression = pick(PROG.filter(item => item.mode === mode));
  document.getElementById('key').textContent = `${pretty(key)} ${mode === 'major' ? 'majeur' : 'mineur'}`;
  document.getElementById('prog').textContent = progression.rn.join(' – ');
  document.getElementById('sub').textContent = progression.name;
}
async function toggleFullscreen() {
  const message = document.getElementById('fullscreen-message');
  message.hidden = true;
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
    else throw new Error('unsupported');
  } catch {
    message.textContent = 'Le plein écran n’est pas disponible dans ce navigateur.';
    message.hidden = false;
  }
}
document.getElementById('next').addEventListener('click', generate);
document.getElementById('fs').addEventListener('click', toggleFullscreen);
document.addEventListener('fullscreenchange', () => {
  document.getElementById('fs').textContent = document.fullscreenElement ? 'Quitter le plein écran' : 'Plein écran';
});
for (const id of ['quality','acc','easy']) document.getElementById(id).addEventListener('change', generate);
document.addEventListener('keydown', event => {
  if (!['Space','Enter'].includes(event.code) || event.repeat || /^(INPUT|SELECT|BUTTON|TEXTAREA|A|SUMMARY)$/.test(event.target.tagName)) return;
  event.preventDefault();
  generate();
});
generate();
