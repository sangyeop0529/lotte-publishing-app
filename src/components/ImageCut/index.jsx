import { useCallback, useEffect, useRef, useState } from "react";
import ContentsTitle from "../ContentsTitle";
import "./index.css";

// 컷팅 도구 본체는 public/tools/image-cut.html (검증된 단일 HTML)을 iframe으로 띄웁니다.
const TOOL_URL = `${import.meta.env.BASE_URL}tools/image-cut.html`;

const tips = [
  "더블클릭 = 컷팅선",
  "자석으로 가장자리에 붙음",
  "Alt = 자석 해제",
  "탭 행 가로 컷팅",
  "ZIP 저장",
];

const ImageCut = () => {
  const [file, setFile] = useState(null);
  const [isOver, setIsOver] = useState(false);
  const inputRef = useRef(null);
  const iframeRef = useRef(null);
  const dirtyRef = useRef(false);

  const openWith = useCallback((f) => {
    if (!f || !f.type.startsWith("image/")) {
      alert("이미지 파일만 열 수 있어요.");
      return;
    }
    dirtyRef.current = false;
    setFile(f);
  }, []);

  const close = useCallback(() => {
    if (
      dirtyRef.current &&
      !window.confirm("작업 중인 컷팅선이 사라져요. 나갈까요?")
    ) {
      return;
    }
    dirtyRef.current = false;
    setFile(null);
  }, []);

  // iframe과 메시지 주고받기
  useEffect(() => {
    if (!file) return;
    const onMessage = (e) => {
      if (e.origin !== window.location.origin) return;
      if (e.source !== iframeRef.current?.contentWindow) return;
      const { type, dirty } = e.data || {};
      if (type === "cut:ready") {
        iframeRef.current.contentWindow.postMessage(
          { type: "cut:load-file", file },
          window.location.origin,
        );
      } else if (type === "cut:state") {
        dirtyRef.current = !!dirty;
      } else if (type === "cut:exit") {
        close();
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("message", onMessage);
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [file, close]);

  // 탭 화면에서 Ctrl+V로 이미지 붙여넣기
  useEffect(() => {
    if (file) return;
    const onPaste = (e) => {
      const item = [...(e.clipboardData?.items || [])].find((i) =>
        i.type.startsWith("image/"),
      );
      if (item) openWith(item.getAsFile());
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [file, openWith]);

  const onDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    openWith(e.dataTransfer.files[0]);
  };

  return (
    <div className="ImageCut">
      <div className="container">
        <ContentsTitle
          title={"이미지 컷팅"}
          description={
            "원본 이미지를 넣으면 전체 화면 작업 모드로 열립니다. 이미지는 브라우저 안에서만 처리돼요."
          }
        />

        <button
          type="button"
          className={`drop-zone ${isOver ? "is-over" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsOver(true);
          }}
          onDragLeave={() => setIsOver(false)}
          onDrop={onDrop}
        >
          <span className="drop-icon" aria-hidden="true">
            ⬆
          </span>
          <strong>이미지를 끌어다 놓거나 클릭해서 선택</strong>
          <span className="drop-sub">Ctrl+V로 붙여넣기도 됩니다</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            openWith(e.target.files[0]);
            e.target.value = "";
          }}
        />

        <ul className="tip-list">
          {tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>

      {file && (
        <div
          className="image-cut-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="이미지 컷팅 작업 모드"
        >
          <iframe ref={iframeRef} src={TOOL_URL} title="이미지 컷팅 도구" />
        </div>
      )}
    </div>
  );
};

export default ImageCut;
