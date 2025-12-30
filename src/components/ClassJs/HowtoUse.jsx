import ClassCode from "./ClassCode";
import "./HowtoUse.css";

const HowtoUse = () => {
  return (
    <div className="howToUse">
      <div className="container">
        <ul className="order-list">
          <li>1. class js 파일 다운 받기</li>
          <li>2. 해당 파일 js 폴더에 넣기</li>
          <li>3. 하단 script 영역에 class js 삽입</li>
        </ul>

        <ClassCode />
      </div>
    </div>
  );
};

export default HowtoUse;
