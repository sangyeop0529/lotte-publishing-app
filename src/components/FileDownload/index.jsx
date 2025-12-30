import ContentsTitle from "../ContentsTitle";
import FileList from "./FileList";
import "./index.css";

const FileLists = [
  { title: "기본", file: "1. basic" },
  { title: "탭", file: "2. tab" },
  { title: "스와이퍼탭", file: "3. swiper_tab" },
  { title: "모달", file: "4. modal" },
  { title: "오디오", file: "5. audio" },
  { title: "서브탭", file: "7. sub_tab" },
  { title: "고정BG", file: "8. fixedBackgroundImage" },
];

const FileDownload = () => {
  return (
    <div className="FileDownload">
      <div className="container">
        <ContentsTitle
          title={"템플릿 다운로드"}
          description={"3차_outer_ver2 (common.js & ga4Event.js 수정)"}
        />
        <div className="files">
          {FileLists.map((item, index) => (
            <FileList key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileDownload;
