import { useState } from "react";
import "./CalculateTop.css";

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
  return (
    <div className="CalculateTop">
      <label className="img-height">
        <input type="text" onChange={onChangeHeight} />
        (이미지 높이값)
      </label>

      <div className="flex-box">
        <div className="flex-box">
          {tops.map((top, index) => (
            <label className="top-value" key={index}>
              <span>#{index + 1}</span>
              <input type="text" onChange={(e) => onChangeTop(index, e)} />
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
