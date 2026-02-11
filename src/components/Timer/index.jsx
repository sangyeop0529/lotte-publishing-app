import ContentsTitle from "../ContentsTitle";
import "./index.css";
import TimerCode from "./TimerCode";

const Timer = () => {
  return (
    <div className="Timer">
      <div className="container">
        <div className="flex-box">
          <ContentsTitle title={"타이머 기능"} />
          <div className="FileList">
            <a href={`/files/timer.js`} download>
              파일 다운로드
            </a>
          </div>
        </div>

        <TimerCode />
      </div>
    </div>
  );
};

export default Timer;
