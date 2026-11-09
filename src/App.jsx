import { useEffect, useRef, useState } from "react";
import Calculate from "./components/Calculate";
import SampleCode from "./components/SampleCode";
import UrlLink from "./components/UrlLink";
import ClassJs from "./components/ClassJs";
import Timer from "./components/Timer";
import ImageCut from "./components/ImageCut";
import FileDownload from "./components/FileDownload";

const tabs = [
  { key: "sampleCode", label: "Sample Code", component: <SampleCode /> },
  { key: "calculate", label: "계산기", component: <Calculate /> },
  // { key: "url", label: "URL 링크", component: <UrlLink /> },
  // { key: "xbrowser", label: "앱 분기처리", new: true, component: <Xbrowser /> },
  { key: "timer", label: "타이머", component: <Timer /> },
  { key: "class", label: "스와이퍼 JS", component: <ClassJs /> },
  { key: "imageCut", label: "이미지 컷팅", new: true, component: <ImageCut /> },
  { key: "file", label: "템플릿 다운로드", new: true, component: <FileDownload /> },
  // {
  //   key: "thumbnailError",
  //   label: "썸네일 에러",
  //   component: <ThumbnailError />,
  // },
  // { key: "img", label: "샘플 이미지", component: <SampleImg /> },
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
      <header className="app-header">
        <h1 className="app-title">Publishing Tools</h1>
        <p className="app-desc">퍼블리싱 작업에 자주 쓰는 도구 모음</p>
      </header>

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
    </div>
  );
}

export default App;
