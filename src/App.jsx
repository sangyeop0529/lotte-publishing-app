import { useState } from "react";
import Calculate from "./components/Calculate";
import Calposition from "./components/CalPosition";
import FileDownload from "./components/FileDownload";
import SampleCode from "./components/SampleCode";
import SampleImg from "./components/SampleImg";
import UrlLink from "./components/UrlLink";
import Eclipse from "./components/Eclipse";

const tabs = [
  { key: "calculate", label: "Vw 계산기", component: <Calculate /> },
  { key: "position", label: "Top 위치값", component: <Calposition /> },
  { key: "url", label: "URL 링크", component: <UrlLink /> },
  { key: "img", label: "샘플 이미지", component: <SampleImg /> },
  { key: "file", label: "파일 다운로드", component: <FileDownload /> },
  // { key: "eclipse", label: "이클립스", component: <Eclipse /> },
];

function App() {
  const [activeTab, setActiveTab] = useState("calculate");
  const activeTabContent = tabs.find((tab) => tab.key === activeTab)?.component;

  return (
    <div className="App">
      <div className="">
        {/* 상단 탭 영역 */}
        <div className="tab-menu">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={activeTab === tab.key ? "active" : ""}>
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
