import { useState } from "react";
import "./TestLink.css";

const TestLink = () => {
  const [url, setUrl] = useState("");
  const handleUrlnput = (e) => {
    setUrl(e.target.value);
  };

  const handleOpenUrl = () => {
    try {
      const match = url.match(/\/gate\/(SNM\d+)\//);
      if (!match) {
        alert("올바른 URL 형식이 아닙니다.");
        return;
      }
      const snmCode = match[1];
      const queryPart = url.split("?")[1] ? url.split("?")[1] : "";
      const baseQuery = queryPart
        ? `?shpgNewsNo=${snmCode}&${queryPart}`
        : `?shpgNewsNo=${snmCode}`;

      const urls = [
        `https://m.lotteshopping.com/shpgnews/shpgnewsDetail${baseQuery}`,
        `https://www.lotteshopping.com/shpgnews/shpgnewsDetail${baseQuery}`,
        `https://m.lotteshopping.com/shpgnews/shpgnewsDetail${baseQuery}&ch=k`,
      ];

      // 클릭 이벤트에서 동시에 열기
      urls.forEach((u) => window.open(u, "_blank"));
    } catch (e) {
      alert("URL 변환 중 오류가 발생했습니다.");
      console.error(e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleOpenUrl();
    }
  };
  return (
    <div className="TestLink">
      <input
        onKeyDown={handleKeyDown}
        onChange={handleUrlnput}
        type="text"
        value={url}
      />

      <button onClick={handleOpenUrl}>Mob/Pc/Kiosk 열기</button>
    </div>
  );
};

export default TestLink;
