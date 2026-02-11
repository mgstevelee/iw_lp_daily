/* ===============================
   🎁 쿠폰 데이터 영역
================================= */

const couponMap = {
  100: ["LP100-7KX2M9"],
  300: ["LP300-K8Q2ZT"],
  500: ["LP500-P9K2XR"]
};

const coupon1000 = [
  "2146B549B47A7","D9BC7558B4A80","52BECDD5F68EA","5CB6656C13847","3D117E4D7632A",
  "FAD34C05B0A18","7CCCAA1B485B3","955582624BC5F","54388F21B5D33","6BEDB3E266634",
  "6C3EFA31000E7","75FF24ACC6E9B","452D914A80FA3","7BEC4D9B1E9DF","367C79EEC957D",
  "3C93CC441AE3D","FB62026DABF5F","1FCD6401DC302","A192C0CB0772B","4AD4793EAF931",
  "6DEF05C01F466","3470946ABF935","9F20C2E3E0D63","B0B555350B30C","E795D0E629850",
  "38B1E7C5F63BF","089C0B3A8F864","19486E5C2D6BD","6A2A79F11B443","0DCFB0696F55F",
  "A2543D7C6B8C6","67157564AC1CD","FAB9A15E0FCAB","8A41C9294255F","2AD79611AD0CE",
  "A51EBA8923CAA","54B74537A0F32","5B7E56B08FF32","5A9E62B9FC3B1","59B97A247B711",
  "EFABFA7BDFB30","8361829298C66","AD2830060B6CC","72DF1C64428DB","DDFD347800F75",
  "8EC9641EF2B7E","2FF8438FF9205","48CF42ECC2BDB","8EF22FFDB6B07","2A66891D2785A"
];

const coupon3000 = [
  "0D29EC8578ED8","0A97A104C5ED5","AE3A747B5D67D","70FFCB40F4EEB","EB4843E67DEF2",
  "586D42CFBCF3C","258964FEAD069","331C7EF7EAD72","CBC9FFEFB0753","3154A2E09E1A7",
  "410F9FAF0EC8D","4315B80F937C9","5E133FAA17972","FDE6509538DD1","6FE972B3C8562",
  "A8F695E41CF25","CCED62B28C4A0","83A8865C5AF37","5E994709CE5CE","692A9C24640D5",
  "022DF9964CF6A","FAF6C172C6B01","384F4A8BCF979","2AD8BF4992347","5CD27B1E2451E",
  "53F3F30DB2084","0DB55ADE9F3D4","16CE9A369358D","10FEB14DA37A5","B055A73526DC6",
  "DDC1C6F1FBFCE","F3404365D4FEA","78F961BACDF35","D79FC0C4D4539","A54D55415638B",
  "EF77D272AC0A9","07431908E8DEE","E80633772FFC3","61352B307596B","699F698B32F9C",
  "C8AE0EF16CAED","396969898E9B5","2BBB6236869AB","4EBBF43D6F468","EBAD5A8CD8075",
  "DC75F32F86FF3","025FAE0DBF64A","1C9217F8175DB","F7D181C79C33F","020B6EE42E2CB"
];

/* ===============================
   🧠 유틸
================================= */

function formatWon(n){
  return `${n.toLocaleString('ko-KR')}원`;
}

function todayKeyKST(){
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0,10);
}

const LS_KEY = 'lpPlayedDate';

/* ===============================
   🎲 확률 로직
================================= */

function pickReward(){
  const r = Math.random() * 100;

  if (r < 90) return 100;
  if (r < 96) return 300;
  if (r < 99) return 500;
  if (r < 99.7) return 1000;
  return 3000;
}

function getCouponCode(amount){
  if (couponMap[amount]) return couponMap[amount][0];
  if (amount === 1000)
    return coupon1000[Math.floor(Math.random()*coupon1000.length)];
  if (amount === 3000)
    return coupon3000[Math.floor(Math.random()*coupon3000.length)];
  return "";
}

/* ===============================
   🍀 클로버 생성
================================= */

function buildCloverButton(){
  const btn = document.createElement('button');
  btn.className = 'lp-clover';
  btn.type = 'button';
  btn.innerHTML = `
    <span class="clover-wrap">
      <svg viewBox="0 0 100 100">
        <circle cx="35" cy="35" r="22"></circle>
        <circle cx="65" cy="35" r="22"></circle>
        <circle cx="35" cy="65" r="22"></circle>
        <circle cx="65" cy="65" r="22"></circle>
      </svg>
    </span>
    <span class="amount"></span>
  `;
  return btn;
}

/* ===============================
   📐 슬롯 정렬
================================= */

function placeCloversFromSlots(){
  const scene = document.querySelector('.lp-scene');
  const boardSvg = document.getElementById('boardSvg');
  const layer = document.getElementById('cloverLayer');
  const slots = [...boardSvg.querySelectorAll('.slot')];

  const sceneRect = scene.getBoundingClientRect();
  const svgRect = boardSvg.getBoundingClientRect();

  layer.style.left = `${svgRect.left - sceneRect.left}px`;
  layer.style.top = `${svgRect.top - sceneRect.top}px`;
  layer.style.width = `${svgRect.width}px`;
  layer.style.height = `${svgRect.height}px`;

  layer.innerHTML = '';

  slots.forEach((slot) => {
    const r = slot.getBoundingClientRect();
    const x = (r.left + r.width/2) - svgRect.left;
    const y = (r.top + r.height/2) - svgRect.top;

    const btn = buildCloverButton();
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
    layer.appendChild(btn);
  });

  wireClicks();
}

function rafPlace(){
  requestAnimationFrame(placeCloversFromSlots);
}

/* ===============================
   🪟 모달
================================= */

const modal = document.getElementById('lpModal');
const modalAmount = document.getElementById('lpModalAmount');
const modalBtn = document.getElementById('lpModalBtn');
const help = document.getElementById('lpHelp');

function openModal(amount){
  const couponCode = getCouponCode(amount);

  modalAmount.textContent = formatWon(amount);

  document.querySelector('.lp-modal__fineprint').innerHTML = `
    쿠폰 코드:<br>
    <b style="font-size:18px">${couponCode}</b><br>
    장바구니에서 적용해주세요.
  `;

  modal.classList.add('show');
}

function closeModal(){
  modal.classList.remove('show');
}

/* ===============================
   🔁 참여 제한
================================= */

function alreadyPlayedToday(){
  return localStorage.getItem(LS_KEY) === todayKeyKST();
}

function setPlayedToday(){
  localStorage.setItem(LS_KEY, todayKeyKST());
}

/* ===============================
   🖱 클릭 로직
================================= */

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
    disableAllClovers();
    return;
  }

  locked = true;
  setPlayedToday();

  const amount = pickReward();
  btn.classList.add('spin');

  btn.addEventListener('animationend', () => {
    btn.classList.add('win');

    // 1천원 이상 강조
    if (amount >= 1000) btn.classList.add('big-win');

    btn.querySelector('.amount').textContent = formatWon(amount);
    openModal(amount);
    locked = false;
  }, { once: true });
}

function disableAllClovers(){
  document.querySelectorAll('.lp-clover').forEach(b => {
    b.disabled = true;
    b.style.cursor = 'default';
  });
}

/* ===============================
   🚀 초기화
================================= */

window.addEventListener('load', () => {

  rafPlace();

  window.addEventListener('resize', rafPlace);
  window.addEventListener('orientationchange', rafPlace);

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', rafPlace);
  }

  const boardSvg = document.getElementById('boardSvg');
  if (boardSvg && 'ResizeObserver' in window) {
    const ro = new ResizeObserver(() => rafPlace());
    ro.observe(boardSvg);
  }

  modalBtn.addEventListener('click', () => {
    closeModal();
    help.textContent = '오늘은 이미 참여했어요! 내일 또 와주세요 💗';
    disableAllClovers();
  });

  if (alreadyPlayedToday()){
    help.textContent = '오늘은 이미 참여했어요! 내일 또 와주세요 💗';
    disableAllClovers();
  }
});
