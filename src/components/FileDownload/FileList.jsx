import "./FileList.css";

const FileList = ({ title, file }) => {
  return (
    <div className="FileList">
      <a href={`/files/${file}.zip`} download>
        {title} 레이아웃
      </a>
    </div>
  );
};

export default FileList;
