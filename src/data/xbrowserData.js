const codeClass = [
  {
    name: "앱 이외 알럿 띄우기",
    items: [
      {
        language: "javascript",
        type: "javascript",
        code: `document.addEventListener("DOMContentLoaded", function () {
  const filter = "win16|win32|win64|mac|macintel";
  const browserInfo = navigator.userAgent;
  const isApp =
    browserInfo.indexOf("LD_Android") > -1 ||
    browserInfo.indexOf("LD_iOS") > -1;

  // PC Web 또는 Mobile Web인 경우 (앱이 아닌 경우)
  const isPcWeb =
    navigator.platform && filter.indexOf(navigator.platform.toLowerCase()) >= 0;
  const isMobileWeb = !isPcWeb && !isApp;

  if (isPcWeb || isMobileWeb) {
    const linkElements = document.querySelectorAll(".link-btn");
    linkElements.forEach((linkElement) => {
      linkElement.addEventListener("click", function (e) {
        e.preventDefault();
        alert("해당링크는 앱에서 확인가능합니다");
      });
    });
  }
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
