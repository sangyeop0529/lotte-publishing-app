import ContentsTitle from "../ContentsTitle";
import "./index.css";
import XbrowserCode from "./XbrowserCode";

const Xbrowser = () => {
  return (
    <div className="Xbrowser">
      <div className="container">
        <div className="flex-box">
          <ContentsTitle title={"앱 분기처리(alert)"} />
        </div>

        <XbrowserCode />
      </div>
    </div>
  );
};

export default Xbrowser;
