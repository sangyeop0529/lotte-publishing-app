import ContentsTitle from "../ContentsTitle";
import TestLink from "./TestLink";

const UrlLink = () => {
  return (
    <div className="UrlLink">
      <div className="container">
        <ContentsTitle
          title={"Test URL Link"}
          description={"기타 URL 링크를 입력해주세요."}
        />
        <TestLink />
      </div>
    </div>
  );
};

export default UrlLink;
