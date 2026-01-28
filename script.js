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

function drawAmount(){
  const r = Math.random();

  // 🎯 10,000원 (0.1%)
  if (r < 0.001) {
    return 10000;
  }

  // 🎲 나머지 99.9% → 100 ~ 9,900 (100원 단위)
  const min = 1;   // 100원
  const max = 99;  // 9,900원
  const unit = Math.floor(Math.random() * (max - min + 1)) + min;

  return unit * 100;
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
