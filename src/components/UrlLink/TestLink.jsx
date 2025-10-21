import { useState } from "react";
import "./TestLink.css";

const TestLink = () => {
  const [url, setUrl] = useState("");
  const handleUrlnput = (e) => {
    setUrl(e.target.value);
  };

  // 공통: URL 생성
  const getUrls = (type = "all") => {
    const match = url.match(/\/gate\/(SNM\d+)\//);
    if (!match) throw new Error("올바른 URL 형식이 아닙니다.");
    const snmCode = match[1];
    const queryPart = url.split("?")[1] ? url.split("?")[1] : "";
    const baseQuery = queryPart
      ? `?shpgNewsNo=${snmCode}&${queryPart}`
      : `?shpgNewsNo=${snmCode}`;

    const urls = {
      mob: `https://m.lotteshopping.com/shpgnews/shpgnewsDetail${baseQuery}`,
      pc: `https://www.lotteshopping.com/shpgnews/shpgnewsDetail${baseQuery}`,
      kiosk: `https://m.lotteshopping.com/shpgnews/shpgnewsDetail${baseQuery}&ch=k`,
    };

    if (type === "all") return Object.values(urls);
    return type in urls ? [urls[type]] : [];
  };

  // 공통: 열기
  const openUrls = (urls) => {
    const windows = urls.map((u) => window.open(u, "_blank"));
    windows.forEach((win, idx) => {
      if (!win) console.warn(`팝업 차단됨: ${urls[idx]}`);
    });
  };

  // 버튼용 핸들러
  const handleOpenUrl = () => {
    try {
      openUrls(getUrls("all"));
    } catch (e) {
      alert(e.message);
      console.error(e);
    }
  };

  const handleOpenUrlOnlyMob = () => {
    try {
      openUrls(getUrls("mob"));
    } catch (e) {
      alert(e.message);
      console.error(e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleOpenUrlOnlyMob();
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

      <div className="btn-group">
        <button onClick={handleOpenUrl}>모두 열기</button>
        <button onClick={handleOpenUrlOnlyMob}>Mobile만 열기</button>
      </div>
    </div>
  );
};

export default TestLink;
