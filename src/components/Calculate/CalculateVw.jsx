import { useState } from "react";
import "./CalculateVw.css";

const CalculateVw = ({ tit, clamp, min, notify = alert }) => {
  const [input, setInput] = useState("");
  const onChangeInput = (e) => {
    setInput(e.target.value);
  };
  const calculate = parseFloat(((input / 750) * 100).toFixed(4));
  const calculateVw = `${calculate}vw`;
  const calculateClamp = `clamp(${input / 2}px, ${calculate}vw, ${input}px)`;
  // min: 화면이 750px보다 넓어져도 원래 px 크기 이상으로 커지지 않음
  const calculateMin = `min(${calculate}vw, ${input}px)`;
  const valueToShow = clamp
    ? calculateClamp
    : min
      ? calculateMin
      : calculateVw;
  const onClickCopy = () => {
    if (!input) {
      notify("값을 입력하세요.");
      return;
    }
    navigator.clipboard
      .writeText(valueToShow.toString())
      .then(() => {
        notify(`복사됨 : ${valueToShow}`);
        setInput("");
      })
      .catch((err) => {
        console.error("클립보드 복사 실패:", err);
        notify("복사 실패: " + err);
      });
  };
  const onKeyDownInput = (e) => {
    if (e.key === "Enter") {
      onClickCopy();
      setInput("");
    }
  };

  return (
    <div className="CalculateVw">
      <h3 className="title">{tit}</h3>
      <div className="flex-box">
        <input
          onChange={onChangeInput}
          onKeyDown={onKeyDownInput}
          type="text"
          value={input}
        />
        <button className="btn" onClick={() => onClickCopy(valueToShow)}>
          {input ? valueToShow : "값 입력"}
        </button>
      </div>
    </div>
  );
};

export default CalculateVw;
