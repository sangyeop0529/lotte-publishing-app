import CalculateVw from "./CalculateVw";
import "./Calculate.css";
import ContentsTitle from "./ContentsTitle";
import CalculateTop from "./CalculateTop";

const descriptionText = [
  `
가로 750px 기준으로 환산한 값입니다.
'Enter' 사용 시 쉽게 복사 가능합니다.
소수점 4자리까지 나타납니다.`,
  `계산 공식 : 이미지 Top값 / 전체이미지 높이값 * 100`,
];

const Calculate = () => {
  return (
    <div className="Calculate">
      <div className="container">
        <ContentsTitle title={"Px to Vw "} description={descriptionText[0]} />
        <div className="vw-box">
          <CalculateVw tit={"normal"} />
          <CalculateVw tit={"clamp"} clamp />
        </div>
      </div>

      <div className="container">
        <ContentsTitle title={"Top percent"} description={descriptionText[1]} />
        <div className="top-percent-box">
          <CalculateTop />
        </div>
      </div>
    </div>
  );
};

export default Calculate;
