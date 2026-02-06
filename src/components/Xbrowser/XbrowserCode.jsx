import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./XbrowserCode.css";
import xbrowserCode from "../../data/xbrowserData";
import { useState } from "react";

const XbrowserCode = () => {
  const [openMap, setOpenMap] = useState({});

  const handleToggle = (groupIdx, itemIdx) => {
    const key = `${groupIdx}-${itemIdx}`;
    setOpenMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCopyCode = (code) => {
    if (code && code.trim() !== "") {
      try {
        navigator.clipboard.writeText(code).then(() => {
          alert("코드가 복사되었습니다.");
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="XbrowserCode">
      <div className="container">
        {xbrowserCode.map((item, idx) => (
          <div className="code-group" key={idx}>
            <h2 className="title">{item.name}</h2>

            {item.items.map((sample, i) => {
              const key = `${idx}-${i}`;
              const isOpen = openMap[key];

              return (
                <div className="code-content" key={i}>
                  <div
                    className="code-header"
                    onClick={() => handleToggle(idx, i)}
                    style={{ cursor: "pointer" }}
                  >
                    <h3>{sample?.type}</h3>
                    <div className="code-btns">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(idx, i);
                        }}
                      >
                        {isOpen ? "접기" : "열기"}
                      </button>
                      <button
                        style={{
                          color: "#fff",
                          backgroundColor: "rgb(76, 175, 223)",
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // 열기 토글 방지
                          handleCopyCode(sample.code);
                        }}
                      >
                        복사
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <SyntaxHighlighter
                      language={sample.language}
                      style={tomorrow}
                    >
                      {sample.code}
                    </SyntaxHighlighter>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default XbrowserCode;
