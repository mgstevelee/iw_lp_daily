function cloverSVG(){
  return `
    <span class="clover-wrap">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <!-- 대각선(×) 배치 -->
        <circle cx="35" cy="35" r="22"></circle>
        <circle cx="65" cy="35" r="22"></circle>
        <circle cx="35" cy="65" r="22"></circle>
        <circle cx="65" cy="65" r="22"></circle>
      </svg>
    </span>`;
}


document.querySelectorAll(".lp-clover").forEach(btn=>{
  btn.innerHTML = cloverSVG();
});

const memberId = "TEST_USER";
const todayKey = `LP_${memberId}_${new Date().toISOString().slice(0,10)}`;

const help = document.getElementById("lpHelp");
const modal = document.getElementById("lpModal");
const modalAmount = document.getElementById("lpModalAmount");

let locked = false;

// ✅ 테스트용: null이면 정상 확률, 숫자면 강제 당첨
const FORCE_AMOUNT = 10000; // 5000 또는 10000으로 바꾸면 강제


function drawAmount(){
   if (FORCE_AMOUNT !== null) return FORCE_AMOUNT;
  const r = Math.random();

  // 👑 10,000원 (0.1%)
  if (r < 0.001) {
    return 10000;
  }

  // 💎 9,000 ~ 9,900원 (0.5%)
  if (r < 0.006) {
    const unit = Math.floor(Math.random() * (99 - 90 + 1)) + 90; // 90~99
    return unit * 100;
  }

  // 🎉 7,000 ~ 8,900원 (1%)
  if (r < 0.016) {
    const unit = Math.floor(Math.random() * (89 - 70 + 1)) + 70; // 70~89
    return unit * 100;
  }

  // ✨ 5,000 ~ 6,900원 (3%)
  if (r < 0.046) {
    const unit = Math.floor(Math.random() * (69 - 50 + 1)) + 50; // 50~69
    return unit * 100;
  }

  // 🔵 2,000 ~ 4,900원 (5%)
  if (r < 0.096) {
    const unit = Math.floor(Math.random() * (49 - 20 + 1)) + 20; // 20~49
    return unit * 100;
  }

  // 🟢 1,000 ~ 1,900원 (7%)
  if (r < 0.166) {
    const unit = Math.floor(Math.random() * (19 - 10 + 1)) + 10; // 10~19
    return unit * 100;
  }

  // 🟡 500 ~ 900원 (10%)
  if (r < 0.266) {
    const unit = Math.floor(Math.random() * (9 - 5 + 1)) + 5; // 5~9
    return unit * 100;
  }

  // ⚪ 200 ~ 400원 (30%)
  if (r < 0.566) {
    const units = [2, 3, 4]; // 200, 300, 400
    return units[Math.floor(Math.random() * units.length)] * 100;
  }

  // 🧊 나머지 (43.4%)
  return 100;
}



function openModal(amount){
  modalAmount.textContent = amount.toLocaleString() + "원";
  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
}

function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden","true");
}

modal.addEventListener("click",(e)=>{
  if (e.target.dataset.close !== undefined) closeModal();
});

if(localStorage.getItem(todayKey)){
  help.textContent = "오늘은 이미 참여했어요! 내일 또 와주세요 💗";
}

document.querySelectorAll(".lp-clover").forEach(btn=>{
  btn.addEventListener("click",()=>{
    if(locked || localStorage.getItem(todayKey)) return;
    locked = true;

    const amount = drawAmount();

    btn.classList.add("spin");

setTimeout(()=>{
  btn.classList.add("win");

  if(amount >= 5000){
    btn.classList.add("big-win");
  }
  if(amount === 10000){
    btn.classList.add("jackpot");
  }

  const span = document.createElement("span");
  span.className = "amount";
  span.textContent = amount.toLocaleString() + "원";
  btn.appendChild(span);
}, 3000);


    setTimeout(()=>{
      localStorage.setItem(todayKey,"1");
      openModal(amount);
    }, 4000);
  });
}); // ✅ forEach 닫힘
