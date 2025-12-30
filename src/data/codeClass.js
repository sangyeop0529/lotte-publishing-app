const codeClass = [
  {
    name: "기본 사용법",
    items: [
      {
        language: "html",
        type: "html",
        code: `<div class="basic"></div>`,
      },
      {
        language: "javascript",
        type: "javascript",
        code: `new ClassSwiper(".flow", {
  slides: 5, // 스와이퍼 이미지 갯수
  imgPath: "./images/slide/1/", // 이미지 경로
  swiperOptions: {
		// ... 옵션값
  },
});`,
      },
    ],
  },
  {
    name: "동일한 스와이퍼가 여러개일 경우",
    items: [
      {
        language: "javascript",
        type: "swiperEls...",
        code: `const swiperEls = [
  { selector: ".basic1", slides: 5, imgPath: "./images/slide/1/" },
  { selector: ".basic2", slides: 5, imgPath: "./images/slide/2/" },
  { selector: ".basic3", slides: 5, imgPath: "./images/slide/3/" },
];

swiperEls.forEach((swiperEl) => {
  new ClassSwiper(swiperEl.selector, {
    slides: swiperEl.slides,
    imgPath: swiperEl.imgPath,
    swiperOptions: {
      spaceRatio: 0.08, // spaceBetween
      pagination: true,
      // navigation: true,
      // scrollbar: true
    },
  });
});`,
      },
    ],
  },
  {
    name: "디졸브(desolve) 형태의 스와이퍼가 필요한 경우",
    items: [
      {
        language: "javascript",
        type: "desolve",
        code: `new ClassSwiper(".fade", {
	type: "fadeIn",
  slides: 3,
  imgPath: "./images/slide/1/",
  swiperOptions: {
		// ... 옵션값
  },
});`,
      },
    ],
  },
  {
    name: "흐르는 형태(flow)의 스와이퍼 배너가 필요한 경우",
    items: [
      {
        language: "javascript",
        type: "flow",
        code: `new ClassSwiper(".flow", {
  type: "flow",
  slides: 2,
  imgPath: "./images/slide/flow/",
  swiperOptions: {
		// ... 옵션값
  },
});`,
      },
    ],
  },
  {
    name: "스와이퍼에 버튼이 필요한 경우",
    items: [
      {
        language: "javascript",
        type: "link-btn",
        code: `new ClassSwiper(".link", {
  slides: 3,
  imgPath: "./images/slide/1/",
  linkBtn: true, // 버튼생성
  dataOrders: [0, null, 1], // 버튼에 맞는 data-order값 설정
  swiperOptions: {
    // ... 옵션값
  },
});`,
      },
    ],
  },
  {
    name: "페이지네이션을 progressbar 형태로 나타낼때",
    items: [
      {
        language: "javascript",
        type: "progressbar ",
        code: `swiperOptions: {
	paginationType: "progressbar",
},`,
      },
    ],
  },
  {
    name: "1/5와 같은 fraction 형태가 필요한 경우",
    items: [
      {
        language: "javascript",
        type: "fraction ",
        code: `swiperOptions: {
  fraction: true,
},`,
      },
    ],
  },
  {
    name: "이미지 alt 값을 사용하고 싶은 경우",
    items: [
      {
        language: "javascript",
        type: "img-alt",
        code: `new ClassSwiper(".basic", {
  slides: 3,
  imgPath: "./images/slide/1/",
  altText: '이미지 alt 값을 넣어주세요.'
  swiperOptions: {
    // ... 옵션값
  },
});`,
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

export default codeClass;
