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

      // 공통 쿼리 문자열 구성
      const baseQuery = queryPart
        ? `?shpgNewsNo=${snmCode}&${queryPart}`
        : `?shpgNewsNo=${snmCode}`;

      // 각각의 버전 URL
      const mobUrl = `https://m.lotteshopping.com/shpgnews/shpgnewsDetail${baseQuery}`;
      const pcUrl = `https://www.lotteshopping.com/shpgnews/shpgnewsDetail${baseQuery}`;
      const kioskUrl = `https://m.lotteshopping.com/shpgnews/shpgnewsDetail${baseQuery}&ch=k`;

      // 순차적으로 0.3초 간격으로 열기
      window.open(mobUrl, "_blank");
      setTimeout(() => window.open(pcUrl, "_blank"), 300);
      setTimeout(() => window.open(kioskUrl, "_blank"), 600);
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
