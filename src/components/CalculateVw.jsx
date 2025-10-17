import { useState } from "react";
import "./CalculateVw.css";

const CalculateVw = ({ tit, clamp }) => {
  const [input, setInput] = useState("");
  const onChangeInput = (e) => {
    setInput(e.target.value);
  };
  const calculate = parseFloat(((input / 750) * 100).toFixed(4));
  const calculateVw = `${calculate}vw`;
  const calculateClamp = `clamp(30px, ${calculate}vw, 60px)`;
  const valueToShow = clamp ? calculateClamp : calculateVw;
  const onClickCopy = () => {
    if (!input) {
      alert("값을 입력하세요.");
      return;
    }

    navigator.clipboard
      .writeText(valueToShow.toString())
      .then(() => {
        alert(`복사됨 : ${valueToShow}`);
      })
      .catch((err) => {
        console.error("클립보드 복사 실패:", err);
        alert("복사 실패: " + err);
      });
  };
  const onKeyDownInput = (e) => {
    if (e.key === "Enter") {
      onClickCopy();
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
        />
        <button className="btn" onClick={() => onClickCopy(valueToShow)}>
          {input ? valueToShow : "값 입력"}
        </button>
      </div>
    </div>
  );
};

export default CalculateVw;
