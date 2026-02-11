// ? HTML 사용법
/*
<div data-time="2612310000" class="schedule">
  <div class="schedule-item before timer">
    <img src="./images/img_03.jpg" alt="" />
  </div>
  <div class="schedule-item after">
    <a href="#" id="link0" data-order="0" class="link-btn">
      <img src="./images/img_03_on.jpg" alt="" />
    </a>
  </div>
</div>
*/

// * 예약 시간 걸기 [S]
const getFormattedDateNum = () => {
  const now = new Date();
  const year = String(now.getFullYear()).slice(2); // 26
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return Number(`${year}${month}${day}${hour}${min}`);
};

// 페이지 로드 시점 기준 시간
const initialTime = getFormattedDateNum();

// 스케줄 요소 캐싱
const scheduleEls = document.querySelectorAll(".schedule");

const checkSchedules = () => {
  const currentTime = getFormattedDateNum(); // YYYYMMDDHHmmss
  let allDone = true;

  scheduleEls.forEach((el, idx) => {
    let targetTime = el.dataset.time;

    if (!targetTime) {
      targetTime = initialTime;
    } else if (targetTime.length === 6) {
      targetTime += "0000";
    } else if (targetTime.length === 8) {
      targetTime += "00";
    }

    targetTime = Number(targetTime);

    logTime = String(targetTime);
    const logYear = `20${logTime.slice(0, 2)}`;
    const logMonth = logTime.slice(2, 4);
    const logDay = logTime.slice(4, 6);
    const logHour = logTime.slice(6, 8);
    const logMin = logTime.slice(8, 10);

    const formatted = `${logYear}년 ${logMonth}월 ${logDay}일 ${logHour}시 ${logMin}분`;

    if (!el.classList.contains("log")) {
      console.log(`Open Date :  ${formatted}`);
      el.classList.add("log");
    }

    if (!targetTime || el.classList.contains("done")) return;

    if (currentTime >= targetTime) {
      el.querySelectorAll(".schedule-item").forEach((child) => {
        const isReserved = child.classList.contains("timer");
        child.classList.toggle("before", !isReserved);
        child.classList.toggle("after", isReserved);
      });
    } else {
      allDone = false;
    }
  });

  if (allDone) {
    clearInterval(intervalId);
  }
};

const intervalId = setInterval(checkSchedules, 1000);
checkSchedules();
// * 예약 시간 걸기 [E]

// * CSS [S]
(() => {
  const STYLE_ID = "timer-style";
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .schedule .before { display: block; }
    .schedule .after  { display: none; }
  `;
  document.head.appendChild(style);
})();
// * CSS [E]
