import ContentsTitle from "../ContentsTitle";
import SampleCodeList from "./SampleCodeList";

const SampleCode = () => {
  return (
    <div className="SampleCode">
      <div className="container">
        <ContentsTitle title={"Sample Code"} />
        <SampleCodeList />
      </div>
    </div>
  );
};

export default SampleCode;
