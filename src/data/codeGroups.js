const codeGroups = [
  {
    name: "Html 기본 모음",
    items: [
      {
        subName: "버튼형",
        language: "html",
        code: `<img src="./images/" class="kioskDel" />
<a href="#" id="link0" data-order="0" class="link-btn kioskDel">
  <img src="./images/" alt="" />
</a>`,
      },
      {
        subName: "토글 박스형",
        language: "html",
        code: `<div class="toggle-box on">
  <div class="toggle-box__btns">
    <img src="./images/toggle_on.jpg" alt="" />
    <img src="./images/toggle_off.jpg" alt="" />
  </div>
  <div class="toggle-box__con">
    <img src="./images/" alt="" />
  </div>
</div>`,
      },
    ],
  },
  {
    name: "floating Btn",
    items: [
      {
        language: "html",
        code: `<div class="img-box">
  <img src="./images/" alt="" />
  <span class="goto-link kioskDel">
    <a href="#" id="link0" data-order="0" class="link-btn">
      <img src="./images/" alt="" />
    </a>
  </span>
</div>`,
      },
      {
        language: "css",
        code: `.goto-link {
  position: absolute;
  width: clamp(275px, 73.3333vw, 550px);
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 255, 0.7);
}
.goto-link:nth-of-type(1) {
  bottom: 10%;
}
`,
      },
    ],
  },
  {
    name: "Swiper 기본형",
    items: [
      {
        language: "html",
        code: `<div class="basic img-box">
  <div class="swiper-mask swiper1">
    <div class="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <img src="./images/" alt="" />
        </div>
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
      <div class="swiper-scrollbar"></div>
    </div>
  </div>
</div>`,
      },
      {
        language: "javascript",
        code: `// swiper 반복문 [S]
const swiperObj1 = {};
const swiperMasks = document.querySelectorAll(".basic .swiper-mask");

swiperMasks.forEach((mask, index) => {
  const swiperIndex = index + 1;
  swiperObj1[\`swiper\${swiperIndex}\`] = new Swiper(
    \`.basic .swiper\${swiperIndex} .swiper\`,
    {
      observer: true,
      observeParents: true,
      slidesPerView: 1,
      spaceBetween: Math.floor(window.innerWidth * 0.0),

      pagination: {
        el: \`.basic .swiper\${swiperIndex} .swiper-pagination\`,
      },
      navigation: {
        nextEl: \`.basic .swiper\${swiperIndex} .swiper-button-next\`,
        prevEl: \`.basic .swiper\${swiperIndex} .swiper-button-prev\`,
      },
      scrollbar: {
        el: \`.basic .swiper\${swiperIndex} .swiper-scrollbar\`,
      },
    }
  );
});
// swiper 반복문 [E]`,
      },
      {
        language: "css",
        code: `/* 만약 position으로 띄울 경우 사용 */
/* .swiper-mask .swiper {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  top: 30%;
} */
.swiper-mask .swiper {
  padding: 0 8vw;
}
.swiper-mask .swiper-pagination {
  margin-top: 8vw;
}
.swiper-pagination-bullet {
  background-color: #efe4e4;
}
.swiper-pagination-bullet-active {
  background-color: #ba0c2f;
}
.swiper-mask .swiper-button-prev,
.swiper-mask .swiper-button-next {
  width: 8vw;
  height: 8vw;
  top: 25%;
}
.swiper-mask .swiper-button-prev {
  left: 8vw;
}
.swiper-mask .swiper-button-next {
  right: 8vw;
}
.swiper-mask .swiper-scrollbar {
  width: 90%;
  height: 0.8vw;
  background-color: #efe4e4;
  margin-top: 3vw;
}
.swiper-mask .swiper-scrollbar-drag {
  background-color: #ba0c2f;
}`,
      },
    ],
  },
  {
    name: "Swiper Fade Effect (디졸브형)",
    items: [
      {
        language: "javascript",
        code: `// swiper 반복문 [S]
const swiperObj1 = {};
const swiperMasks = document.querySelectorAll(".fade .swiper-mask");

swiperMasks.forEach((mask, index) => {
  const swiperIndex = index + 1;
  swiperObj1[\`swiper\${swiperIndex}\`] = new Swiper(
    \`.fade .swiper\${swiperIndex} .swiper\`,
    {
      observer: true,
      observeParents: true,
      slidesPerView: 1,
      loop: true,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      speed: 2000,
      autoplay: {
        delay: 1500,
        disableOnInteraction: false,
      },
      allowTouchMove: false,
    }
  );
});
// swiper 반복문 [E]`,
      },
    ],
  },
  {
    name: "흐르는 배너 (Swiper)",
    items: [
      {
        language: "html",
        code: `<div class="flow">
  <div class="swiper-mask swiper1">
    <div class="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <img src="./images/" alt="" />
        </div>
        <div class="swiper-slide">
          <img src="./images/" alt="" />
        </div>
      </div>
    </div>
  </div>
</div>`,
      },
      {
        language: "javascript",
        code: `const swiperObj1 = {};
const swiperFlowMasks = document.querySelectorAll(".flow .swiper-mask");

swiperFlowMasks.forEach((mask, index) => {
  const swiperIndex = index + 1;
  swiperObj1[\`swiper\${swiperIndex}\`] = new Swiper(
    \`.flow .swiper\${swiperIndex} .swiper\`,
    {
      slidesPerView: "auto",
      spaceBetween: Math.floor(window.innerWidth * 0.0),
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        reverseDirection: false, // 방향
      },
      loop: true,
      speed: 20000,
      observer: true,
      observeParents: true,
      allowTouchMove: false,
    }
  );
});`,
      },
      {
        language: "css",
        code: `.flow .swiper-wrapper {
  transition-timing-function: linear !important;
}
.flow .swiper-wrapper .swiper-slide {
  /* 이미지의 가로값 계산 */
  width: clamp(820px, 218.6666vw, 1640px);
}`,
      },
    ],
  },
  {
    name: "Swiper Pagination fraction",
    items: [
      {
        language: "html",
        code: `<div class="basic">
  <div class="swiper-mask swiper1">
    <div class="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <img src="./images/" alt="" />
        </div>
      </div>
      <div class="fraction-pagination"></div>
    </div>
  </div>
</div>`,
      },
      {
        language: "javascript",
        code: `// swiper 반복문 [S]
const swiperObj1 = {};
const swiperMasks = document.querySelectorAll(".basic .swiper-mask");
const fractionEl = document.querySelectorAll(".fraction-pagination");

swiperMasks.forEach((mask, index) => {
  const swiperIndex = index + 1;
  swiperObj1[\`swiper\${swiperIndex}\`] = new Swiper(
    \`.basic .swiper\${swiperIndex} .swiper\`,
    {
      observer: true,
      observeParents: true,
      slidesPerView: 1,
      spaceBetween: Math.floor(window.innerWidth * 0.0),
      on: {
        init: function () {
          updateFraction(this, fractionEl[index]);
        },
        slideChange: function () {
          updateFraction(this, fractionEl[index]);
        },
      },
    }
  );
});
function updateFraction(swiper, fractionEl) {
  if (!fractionEl) return;
  const current = swiper.realIndex + 1;
  const total = swiper.slides.length;
  fractionEl.innerHTML = \`<img src="./images/fraction\${total}/\${current}.png" alt="\${current}/\${total}" />\`;
}
// swiper 반복문 [E]`,
      },
      {
        language: "css",
        code: `.fraction-pagination {
  width: clamp(27.5px, 7.3333vw, 55px);
  height: clamp(15px, 4vw, 30px);
  margin: 0 auto;
  margin-top: 8vw;
}`,
      },
    ],
  },
  /*
  {
    name: "",
    items: [
      {
        language: "",
        code: ``,
      },
      {
        language: "",
        code: ``,
      },
    ],
  },
  */
];

export default codeGroups;
