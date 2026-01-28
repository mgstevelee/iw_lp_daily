// ===== SVG 네잎 생성 =====
function createCloverSVG(){
  return `
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="28" r="22"/>
    <circle cx="72" cy="50" r="22"/>
    <circle cx="50" cy="72" r="22"/>
    <circle cx="28" cy="50" r="22"/>
  </svg>`;
}

// 초기 렌더
document.querySelectorAll(".lp-clover").forEach(btn=>{
  btn.innerHTML = createCloverSVG();
});

// ===== 테스트용 회원 =====
const memberId = "TEST_USER";
const todayKey = `LP_${memberId}_${new Date().toISOString().slice(0,10)}`;
const help = document.getElementById("lpHelp");

// ===== 확률 =====
function drawAmount(){
  const r = Math.random();
  if(r < 0.8) return 100;
  if(r > 0.999) return 1000;
  return Math.floor((Math.random()*89+11))*10;
}

// ===== 팝업 =====
const modal = document.getElementById("lpModal");
const modalAmount = document.getElementById("lpModalAmount");

function openModal(amount){
  modalAmount.textContent = amount + "원";
  modal.classList.add("show");
}

modal.addEventListener("click",e=>{
  if(e.target.dataset.close) modal.classList.remove("show");
});

// ===== 클릭 로직 =====
if(localStorage.getItem(todayKey)){
  help.textContent = "오늘은 이미 참여했어요! 내일 또 와주세요 💗";
}else{
  help.textContent = "네잎클로버를 눌러 오늘의 행운을 뽑아보세요!";
}

let locked = false;

document.querySelectorAll(".lp-clover").forEach(btn=>{
  btn.addEventListener("click",()=>{
    if(locked || localStorage.getItem(todayKey)) return;
    locked = true;

    const amount = drawAmount();

    btn.classList.add("spin");   // ✅ 여기 그대로 OK

    setTimeout(()=>{
      btn.classList.add("win");
      const span = document.createElement("span");
      span.textContent = amount + "원";
      btn.appendChild(span);
    },3000);

    setTimeout(()=>{
      localStorage.setItem(todayKey,"1");
      openModal(amount);
    },4000);
  });
});

