import { useCallback, useEffect, useState } from "react";
import CalculateVw from "./CalculateVw";
import ContentsTitle from "../ContentsTitle";
import CalculateTop from "../CalPosition";
import "./index.css";

const descriptionText = `
가로 750px 기준으로 환산한 값입니다.
'Enter' 사용 시 쉽게 복사 가능합니다.
소수점 4자리까지 나타납니다.`;

// Px → Vw 와 Top 위치값을 한 탭에서 사용하는 계산기
const Calculate = () => {
  const [toast, setToast] = useState("");

  // 복사·안내 메시지를 alert 대신 잠깐 떴다 사라지는 안내로 보여줍니다
  const notify = useCallback((message) => setToast(message), []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="Calculate">
      <section className="calc-section">
        <ContentsTitle title={"Px to Vw"} description={descriptionText} />
        <div className="vw-box">
          <CalculateVw tit={"normal"} notify={notify} />
          <CalculateVw tit={"clamp"} clamp notify={notify} />
          <CalculateVw tit={"min"} min notify={notify} />
        </div>
      </section>

      <section className="calc-section">
        <CalculateTop notify={notify} />
      </section>

      {toast && (
        <p className="calc-toast" role="status">
          {toast}
        </p>
      )}
    </div>
  );
};

export default Calculate;
