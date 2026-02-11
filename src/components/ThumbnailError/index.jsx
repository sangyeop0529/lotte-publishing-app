import ContentsTitle from "../ContentsTitle";
import HowtoUse from "./HowtoUse";
import "./index.css";

const ThumbnailError = () => {
  return (
    <div className="ThumbnailError">
      <div className="container">
        <div className="flex-box">
          <ContentsTitle title={"썸네일 숨김 시 오류"} description={""} />
        </div>

        <HowtoUse />
      </div>
    </div>
  );
};

export default ThumbnailError;
