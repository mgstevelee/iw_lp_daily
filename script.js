/* ---------- Utils ---------- */
function formatWon(n){ return `${n.toLocaleString('ko-KR')}원`; }

function todayKeyKST(){
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0,10);
}

const LS_KEY = 'lpPlayedDate';

/* ---------- Reward ---------- */
function pickReward(){
  const r = Math.floor(Math.random() * 10000);

  if (r < 10) return 10000; // 0.1%
  if (r < 60)  return 9000 + Math.floor(Math.random() * 10) * 100; // 0.5% (9000~9900)
  if (r < 160) return 7000 + Math.floor(Math.random() * 20) * 100; // 1% (7000~8900)
  if (r < 460) return 5000 + Math.floor(Math.random() * 20) * 100; // 3% (5000~6900)
  if (r < 960) return 2000 + Math.floor(Math.random() * 30) * 100; // 5% (2000~4900)
  if (r < 1660) return 1000 + Math.floor(Math.random() * 10) * 100; // 7% (1000~1900)
  if (r < 2660) return 500 + Math.floor(Math.random() * 5) * 100;   // 10% (500~900)
  if (r < 5660) return 200 + Math.floor(Math.random() * 3) * 100;   // 30% (200~400)
  return 100;
}

/* ---------- Clover Button ---------- */
function buildCloverButton(){
  const btn = document.createElement('button');
  btn.className = 'lp-clover';
  btn.type = 'button';
  btn.innerHTML = `
    <span class="clover-wrap">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="35" cy="35" r="22"></circle>
        <circle cx="65" cy="35" r="22"></circle>
        <circle cx="35" cy="65" r="22"></circle>
        <circle cx="65" cy="65" r="22"></circle>
      </svg>
    </span>
    <span class="amount" aria-hidden="true"></span>
  `;
  return btn;
}

/* ---------- Slot Placement (정렬 핵심) ---------- */
function placeCloversFromSlots(){
  const scene = document.querySelector('.lp-scene');
  const svg = document.getElementById('boardSvg');
  const layer = document.getElementById('cloverLayer');
  const slots = [...svg.querySelectorAll('.slot')];

  const sceneRect = scene.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();

  // ✅ 레이어를 보드 박스에 딱 붙임 (좌표계 통일!)
  layer.style.left = `${svgRect.left - sceneRect.left}px`;
  layer.style.top = `${svgRect.top - sceneRect.top}px`;
  layer.style.width = `${svgRect.width}px`;
  layer.style.height = `${svgRect.height}px`;

  layer.innerHTML = '';

  slots.forEach((slot) => {
    const r = slot.getBoundingClientRect();

    // ✅ x,y는 "svgRect" 기준(= layer 기준)으로 계산
    const x = (r.left + r.width/2) - svgRect.left;
    const y = (r.top + r.height/2) - svgRect.top;

    const btn = buildCloverButton(); // 너 기존 함수
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;

    layer.appendChild(btn);
  });

  wireClicks(); // 너 기존 클릭 바인딩
}

window.addEventListener('load', placeCloversFromSlots);
window.addEventListener('resize', placeCloversFromSlots);

/* ---------- Modal ---------- */
const modal = document.getElementById('lpModal');
const modalAmount = document.getElementById('lpModalAmount');
const modalBtn = document.getElementById('lpModalBtn');
const help = document.getElementById('lpHelp');

function openModal(amount){
  modalAmount.textContent = formatWon(amount);
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
}
function closeModal(){
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
}

/* ---------- Daily ---------- */
function alreadyPlayedToday(){
  return localStorage.getItem(LS_KEY) === todayKeyKST();
}
function setPlayedToday(){
  localStorage.setItem(LS_KEY, todayKeyKST());
}

/* ---------- Click ---------- */
let locked = false;

function wireClicks(){
  document.querySelectorAll('.lp-clover').forEach((btn) => {
    btn.onclick = () => onPick(btn);
  });
}

function onPick(btn){
  if (locked) return;

  if (alreadyPlayedToday()){
  help.textContent = '오늘은 이미 참여했어요! 내일 또 와주세요 💗';
  return; // ✅ 팝업 다시 안 뜨게
}

  locked = true;
  setPlayedToday();

  const amount = pickReward();

  btn.classList.add('spin');

  // 스핀 중복 방지 + 끝나면 결과 표시
  const onEnd = () => {
    btn.removeEventListener('animationend', onEnd);

    btn.classList.add('win');
    if (amount >= 5000) btn.classList.add('big-win');

    btn.querySelector('.amount').textContent = formatWon(amount);
    openModal(amount);

    locked = false;
  };

  btn.addEventListener('animationend', onEnd, { once: true });
}

/* ---------- Init ---------- */
window.addEventListener('load', () => {
    modalBtn.addEventListener('click', () => {
    closeModal();
  help.textContent = '오늘은 이미 참여했어요! 내일 또 와주세요 💗';
});

  placeCloversFromSlots();
  window.addEventListener('resize', placeCloversFromSlots);

  if (alreadyPlayedToday()){
    help.textContent = '오늘은 이미 참여했어요! 내일 또 와주세요 💗';
  }
});

function disableAllClovers(){
  document.querySelectorAll('.lp-clover').forEach(b => {
    b.disabled = true;
    b.style.cursor = 'default';
  });
}
