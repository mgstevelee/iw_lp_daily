document.addEventListener("DOMContentLoaded", () => {
  function cloverSVG(){
    // ✅ "십자가(+) 모양"이 아니라, 사진처럼 "정사각 느낌"의 대칭 4잎(대각 배치)
    // (원 4개를 사각의 꼭짓점 방향으로 배치)
    return `
      <span class="clover-wrap">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="35" cy="35" r="22"></circle>
          <circle cx="65" cy="35" r="22"></circle>
          <circle cx="35" cy="65" r="22"></circle>
          <circle cx="65" cy="65" r="22"></circle>
        </svg>
      </span>`;
  }

  const clovers = document.querySelectorAll(".lp-clover");
  clovers.forEach(btn => { btn.innerHTML = cloverSVG(); });

  const memberId = "TEST_USER";
  const todayKey = `LP_${memberId}_${new Date().toISOString().slice(0,10)}`;

  const help = document.getElementById("lpHelp");
  const modal = document.getElementById("lpModal");
  const modalAmount = document.getElementById("lpModalAmount");

  let locked = false;

  // ✅ 확률 테이블
  // 10,000 = 0.1%
  // 9,000~9,900 = 0.5%
  // 7,000~8,900 = 1%
  // 5,000~6,900 = 3%
  // 2,000~4,900 = 5%
  // 1,000~1,900 = 7%
  // 500~900 = 10%
  // 200~400 = 30%
  // 나머지 = 100
  function drawAmount(){
    // URL 파라미터로 테스트: ?force=5000 / ?force=10000
    const params = new URLSearchParams(location.search);
    const forced = Number(params.get("force"));
    if (forced && forced % 100 === 0) return forced;

    const r = Math.random();

    const pickFromStep = (min, max, step=100) => {
      const count = Math.floor((max - min) / step) + 1;
      return min + (Math.floor(Math.random() * count) * step);
    };

    // 누적확률
    if (r < 0.001) return 10000; // 0.1%
    if (r < 0.001 + 0.005) return pickFromStep(9000, 9900); // 0.5%
    if (r < 0.001 + 0.005 + 0.01) return pickFromStep(7000, 8900); // 1%
    if (r < 0.001 + 0.005 + 0.01 + 0.03) return pickFromStep(5000, 6900); // 3%
    if (r < 0.001 + 0.005 + 0.01 + 0.03 + 0.05) return pickFromStep(2000, 4900); // 5%
    if (r < 0.001 + 0.005 + 0.01 + 0.03 + 0.05 + 0.07) return pickFromStep(1000, 1900); // 7%
    if (r < 0.001 + 0.005 + 0.01 + 0.03 + 0.05 + 0.07 + 0.10) return pickFromStep(500, 900); // 10%
    if (r < 0.001 + 0.005 + 0.01 + 0.03 + 0.05 + 0.07 + 0.10 + 0.30) return pickFromStep(200, 400); // 30%

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
    if (e.target && e.target.dataset && e.target.dataset.close !== undefined) closeModal();
  });

  if(localStorage.getItem(todayKey)){
    help.textContent = "오늘은 이미 참여했어요! 내일 또 와주세요 💗";
  }

  clovers.forEach(btn=>{
    btn.addEventListener("click",()=>{
      if(locked || localStorage.getItem(todayKey)) return;
      locked = true;

      const amount = drawAmount();

      // 초기화(혹시 재사용 시)
      btn.classList.remove("win","big-win");
      const old = btn.querySelector(".amount");
      if (old) old.remove();

      btn.classList.add("spin");

      setTimeout(()=>{
        btn.classList.add("win");

        // 5천 이상: big-win
        if (amount >= 5000) btn.classList.add("big-win"); // ✅ 1만원도 동일하게 big-win

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
});
