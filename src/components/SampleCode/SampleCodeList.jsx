import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import codeGroups from "../../data/codeGroups";
import "./SampleCodeList.css";
import { useState } from "react";

function SampleCodeList() {
  const [openIndexes, setOpenIndexes] = useState({});

  const handleCopyCode = (code) => {
    if (code && code.trim() !== "") {
      try {
        navigator.clipboard.writeText(code).then(() => {
          alert(`코드가 복사되었습니다.`);
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggle = (gIndex, iIndex) => {
    const key = `${gIndex}-${iIndex}`;
    setOpenIndexes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="SampleCodeList">
      {codeGroups.map((group, gIndex) => (
        <div key={gIndex} className="code-group">
          {group.name && <h2 className="title">{group.name}</h2>}
          {group.items.map((item, iIndex) => {
            const key = `${gIndex}-${iIndex}`;
            const isOpen = openIndexes[key];
            return (
              <div className="code-content" key={iIndex}>
                <div
                  className="code-header"
                  onClick={() => handleToggle(gIndex, iIndex)}
                  style={{ cursor: "pointer" }}>
                  <h3>
                    {item.language}
                    {item.subName && (
                      <span className="subName">({item.subName})</span>
                    )}
                  </h3>
                  <div className="code-btns">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(gIndex, iIndex);
                      }}>
                      {isOpen ? "접기" : "열기"}
                    </button>
                    <button
                      style={{
                        color: "#fff",
                        backgroundColor: "rgb(76, 175, 80)",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyCode(item.code);
                      }}>
                      복사
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <SyntaxHighlighter language={item.language} style={tomorrow}>
                    {item.code}
                  </SyntaxHighlighter>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default SampleCodeList;
