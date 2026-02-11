const codeClass = [
  {
    name: "수정된 코드",
    items: [
      {
        language: "javascript",
        type: "javascript",
        code: `const headEl = document.querySelector(".__head");
const detailEl = document.querySelector(".__detail__");

if (!detailEl) return;

const headH = headEl?.getBoundingClientRect().height ?? 0;
const headDetail = headH + detailEl.getBoundingClientRect().top + window.pageYOffset;`,
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
