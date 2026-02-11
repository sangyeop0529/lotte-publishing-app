import ThumbnailErrorCode from "./ThumbnailErrorCode";
import "./HowtoUse.css";

const HowtoUse = () => {
  return (
    <div className="howToUse">
      <div className="container">
        <ul className="order-list">
          <li>outer.js 495번째</li>
          <li>const headDetail =&gt; 아래 코드로 변경 </li>
        </ul>

        <ThumbnailErrorCode />
      </div>
    </div>
  );
};

export default HowtoUse;
