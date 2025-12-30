// custom swiper version 1.4.0
const SWIPER_PRESETS = {
  basic: {
    effect: "slide",
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceRatio: 0,
    loop: false,
    allowTouchMove: true,
  },
  fadeIn: {
    effect: "fade",
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    loop: true,
    fadeEffect: { crossFade: true },
    speed: 2000,
    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
    },
    allowTouchMove: false,
  },
  // type flow 추가 2025.11.25
  flow: {
    effect: "slide",
    observer: true,
    observeParents: true,
    slidesPerView: "auto",
    loop: true,
    speed: 10000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      reverseDirection: false,
    },
    allowTouchMove: false,
  },
};

class ClassSwiper {
  constructor(selector, options = {}) {
    this.selector = selector;
    this.container = document.querySelector(selector);
    if (!this.container) return;

    const defaultOptions = {
      type: "basic",
      slides: 3,
      imgPath: "",
      altText: "", // alt 텍스트 추가 2025.12.18
      linkBtn: false, // 링크버튼 추가 2025.11.24
      dataOrders: [],
      swiperOptions: {},
    };

    this.opts = { ...defaultOptions, ...options };

    const preset = SWIPER_PRESETS[this.opts.type] || {};

    this.opts.swiperOptions = {
      ...preset,
      ...(options.swiperOptions || {}),
    };

    this.buildHTML();
    this.initSwiper();
  }

  buildHTML() {
    const mask = document.createElement("div");
    mask.className = "swiper-mask";

    const wrapper = document.createElement("div");
    wrapper.className = "swiper";

    const inner = document.createElement("div");
    inner.className = "swiper-wrapper";

    for (let i = 1; i <= this.opts.slides; i++) {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";

      const img = document.createElement("img");
      img.src = `${this.opts.imgPath}${i}.png`;
      img.alt = this.opts.altText || ``; // alt 텍스트 추가 2025.12.18

      slide.appendChild(img);

      // 링크버튼 추가 2025.11.24
      if (this.opts.linkBtn) {
        const idList = this.opts.dataOrders;
        const customId = idList[i - 1];

        if (customId === null || customId === undefined) {
          inner.appendChild(slide);
          continue;
        }

        const span = document.createElement("span");
        span.className = "goto-link kioskDel";
        const a = document.createElement("a");
        a.href = "#";
        a.id = customId;
        a.dataset.order = customId;
        a.className = "link-btn";
        const img = document.createElement("img");
        img.src = "./images/link-btn.png";
        img.alt = "link-btn";

        a.appendChild(img);
        span.appendChild(a);
        slide.appendChild(span);
      }

      inner.appendChild(slide);
    }

    wrapper.appendChild(inner);
    mask.appendChild(wrapper);
    this.container.appendChild(mask);

    const opts = this.opts.swiperOptions;

    if (opts.pagination) {
      const pagination = document.createElement("div");
      pagination.className = "swiper-pagination";
      wrapper.appendChild(pagination);
    }

    if (opts.navigation) {
      const prev = document.createElement("div");
      prev.className = "swiper-button-prev";
      const next = document.createElement("div");
      next.className = "swiper-button-next";
      wrapper.appendChild(prev);
      wrapper.appendChild(next);
    }

    if (opts.scrollbar) {
      const scrollbar = document.createElement("div");
      scrollbar.className = "swiper-scrollbar";
      wrapper.appendChild(scrollbar);
    }

    // fraction 추가 2025.11.25
    if (opts.fraction) {
      const fraction = document.createElement("div");
      fraction.className = "fraction-pagination";
      wrapper.appendChild(fraction);
    }
  }

  initSwiper() {
    const swiperEl = this.container.querySelector(".swiper");
    const base = this.opts.swiperOptions;

    const swiperConfig = {
      effect: base.effect,
      slidesPerView: base.slidesPerView,
      spaceBetween: Math.floor(window.innerWidth * (base.spaceRatio || 0)),
      observer: base.observer,
      observeParents: base.observeParents,
      loop: base.loop,
      allowTouchMove: base.allowTouchMove,
    };

    if (base.fadeEffect) swiperConfig.fadeEffect = base.fadeEffect;
    if (base.speed) swiperConfig.speed = base.speed;
    if (base.autoplay) swiperConfig.autoplay = base.autoplay;
    if (base.pagination) {
      swiperConfig.pagination = {
        el: `${this.selector} .swiper-pagination`,
        clickable: true,
        type: base.paginationType || "bullets",
      };
    } else swiperConfig.pagination = false;
    if (base.navigation) {
      swiperConfig.navigation = {
        nextEl: `${this.selector} .swiper-button-next`,
        prevEl: `${this.selector} .swiper-button-prev`,
      };
    } else swiperConfig.navigation = false;
    if (base.scrollbar) {
      swiperConfig.scrollbar = {
        el: `${this.selector} .swiper-scrollbar`,
        draggable: true,
      };
    } else swiperConfig.scrollbar = false;

    // fraction 추가 2025.11.25
    if (base.fraction) {
      const fractionEl = this.container.querySelector(".fraction-pagination");

      swiperConfig.on = {
        init: (swiper) => this.updateFraction(swiper, fractionEl),
        slideChange: (swiper) => this.updateFraction(swiper, fractionEl),
      };
    }

    this.swiperInstance = new Swiper(swiperEl, swiperConfig);
  }

  // fraction 추가 2025.11.25
  updateFraction(swiper, fractionEl) {
    if (!fractionEl) return;

    const parent = swiper.el.closest(".swiper-mask");
    const total = parent.querySelectorAll(".swiper-slide").length;
    const current = swiper.realIndex + 1;

    fractionEl.innerHTML = `
    <img src="./images/fraction/${total}/${current}.png" alt="${current}/${total}" />
  `;
  }
}
