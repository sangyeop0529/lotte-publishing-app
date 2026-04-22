import { useEffect, useRef, useState } from "react";
import Calculate from "./components/Calculate";
import Calposition from "./components/CalPosition";
import SampleCode from "./components/SampleCode";
import UrlLink from "./components/UrlLink";
import ClassJs from "./components/ClassJs";
import Timer from "./components/Timer";

const tabs = [
  { key: "calculate", label: "Vw 계산기", component: <Calculate /> },
  { key: "position", label: "Top 위치값", component: <Calposition /> },
  { key: "url", label: "URL 링크", component: <UrlLink /> },
  // { key: "xbrowser", label: "앱 분기처리", new: true, component: <Xbrowser /> },
  { key: "timer", label: "타이머", new: true, component: <Timer /> },
  { key: "class", label: "스와이퍼 JS", component: <ClassJs /> },
  // {
  //   key: "thumbnailError",
  //   label: "썸네일 에러",
  //   component: <ThumbnailError />,
  // },
  // { key: "img", label: "샘플 이미지", component: <SampleImg /> },
  // { key: "file", label: "파일 다운로드", component: <FileDownload /> },
];

function App() {
  const [activeTab, setActiveTab] = useState("calculate");
  const activeTabContent = tabs.find((tab) => tab.key === activeTab)?.component;

  const tabMenuRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (!tabMenuRef.current) return;

      const menuWidth = tabMenuRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;

      setIsScrollable(menuWidth > viewportWidth);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <div className="App">
      <div className="">
        {/* 상단 탭 영역 */}
        <div
          ref={tabMenuRef}
          className={`tab-menu ${isScrollable ? "is-scroll" : ""}`}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={[activeTab === tab.key && "active", tab.new && "new"]
                .filter(Boolean)
                .join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 선택된 탭 내용 */}
        <div className="tab-content">{activeTabContent}</div>
      </div>

      {/* 하단 영역 */}
      <SampleCode />
    </div>
  );
}

export default App;
