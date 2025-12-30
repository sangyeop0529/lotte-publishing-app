import ContentsTitle from "../ContentsTitle";
import HowtoUse from "./HowtoUse";
import "./index.css";

const ClassJs = () => {
  return (
    <div className="ClassJs">
      <div className="container">
        <div className="flex-box">
          <ContentsTitle
            title={"Class JS"}
            description={"swiper_class_1.3.1 버전 적용"}
          />
          <div className="FileList">
            <a href={`/files/class.js`} download>
              파일 다운로드
            </a>
          </div>
        </div>

        <HowtoUse />
      </div>
    </div>
  );
};

export default ClassJs;
