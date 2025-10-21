import { useState } from "react";
import ContentsTitle from "../ContentsTitle";
import SampleCodeList from "./SampleCodeList";
import "./index.css";

const SampleCode = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    setSearchTerm(inputValue.trim());
  };

  return (
    <div className="SampleCode">
      <div className="container">
        <div className="flex-box">
          <ContentsTitle title={"Sample Code"} />
          <div className="code-search">
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              placeholder="제목 또는 내용 검색"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <div className="">
              <button onClick={handleSearch}>검색</button>
            </div>
          </div>
        </div>
        <SampleCodeList searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default SampleCode;
