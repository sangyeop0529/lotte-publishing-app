import ContentsTitle from "../ContentsTitle";
import "./index.css";

const color = Math.floor(Math.random() * 16777215).toString(16);

const SampleImg = () => {
  const handleCopy = () => {
    try {
      navigator.clipboard
        .writeText(
          `<img src="https://placehold.co/750x900/${color}/fff" alt="" />`
        )
        .then(() => {
          alert(`코드가 복사되었습니다.`);
        });
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveToSite = () => {
    window.open("https://placehold.co/", "_blank ");
  };
  return (
    <div className="SampleImg">
      <div className="container">
        <ContentsTitle
          title={"임시이미지"}
          description={"배경색은 랜덤으로 설정하였습니다."}
        />
        <div className="flex-box">
          <p className="img-area">
            https://placehold.co/가로값x세로값/배경색/글자색
          </p>
          <div className="btn-group">
            <button onClick={handleCopy}>복사하기</button>
            <button onClick={handleMoveToSite}>참고문서</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleImg;
