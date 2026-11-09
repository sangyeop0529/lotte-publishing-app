import "./ContentsTitle.css";

const ContentsTitle = ({ title, description }) => {
  return (
    <div className="ContentsTitle">
      <h2 className="title">{title}</h2>
      <p className="description">
        {typeof description === "string" ? description.trim() : description}
      </p>
    </div>
  );
};

export default ContentsTitle;
