function cloverSVG(){
  // ✅ 완전 대칭 4잎 (원 4개)
  return `
    <span class="clover-wrap">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="28" r="22"></circle>
        <circle cx="72" cy="50" r="22"></circle>
        <circle cx="50" cy="72" r="22"></circle>
        <circle cx="28" cy="50" r="22"></circle>
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
  if (r < 0.8) return 100;
  if (r > 0.999) return 1000;
  return Math.floor((Math.random()*89 + 11)) * 10; // 110~990 (임시)
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

    btn.classList.add("spin");  // ✅ 버튼에 spin

    setTimeout(()=>{
      btn.classList.add("win");
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
});
