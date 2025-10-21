import { useState } from "react";
import "./index.css";

const CalculateTop = () => {
  const [height, setHeight] = useState(0);
  const [tops, setTops] = useState([""]);
  const [percents, setPercents] = useState([]);

  const onChangeHeight = (e) => {
    setHeight(e.target.value);
  };

  const onChangeTop = (index, e) => {
    const newTops = [...tops];
    newTops[index] = e.target.value;
    setTops(newTops);
  };

  const handleClone = () => {
    setTops([...tops, ""]);
  };

  const handleCalculatePercent = () => {
    if (!height || height == 0) return;

    const newPercents = tops.map((top) => {
      const value = parseFloat(top);
      if (isNaN(value)) return 0;
      return parseFloat(((value / height) * 100).toFixed(4));
    });

    setPercents(newPercents);
  };

  const onKeyDownInput = (e) => {
    if (e.key === "Enter") {
      handleCalculatePercent();
    }
  };
  return (
    <div className="CalculateTop">
      <label className="img-height">
        <input type="text" onChange={onChangeHeight} />
        (이미지 높이값)
      </label>

      <div className="flex-box">
        <div className="value-box">
          {tops.map((top, index) => (
            <label className="top-value" key={index}>
              <span className="num">#{index + 1}</span>
              <input
                type="text"
                onKeyDown={onKeyDownInput}
                onChange={(e) => onChangeTop(index, e)}
              />
            </label>
          ))}
        </div>

        <div className="btn-box">
          <button className="btn" onClick={handleClone}>
            +
          </button>
          <button className="btn" onClick={handleCalculatePercent}>
            계산
          </button>
        </div>
      </div>

      <h3 className="result__text">결과값</h3>
      <div className="list__warp">
        {tops.map((top, index) => (
          <p key={index}>
            {top && percents[index] !== undefined
              ? `${index + 1}번 : ${percents[index]}%`
              : ""}
          </p>
        ))}
      </div>
    </div>
  );
};

export default CalculateTop;
