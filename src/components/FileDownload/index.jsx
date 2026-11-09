import { useEffect, useState } from "react";
import ContentsTitle from "../ContentsTitle";
import { customizeTemplate, invalidFolderChars } from "./templateZip";
import templateHistory from "../../data/templateHistory";
import "./index.css";

const FILE_BASE = `${import.meta.env.BASE_URL}files/`;

const templates = [
  {
    title: "기본",
    file: "1. basic",
    // desc: "이미지만 쌓는 기본형",
    // tags: ["기본"],
    // size: "169KB",
  },
  {
    title: "탭",
    file: "2. tab",
    // desc: "탭 2개 + 탭별 콘텐츠",
    // tags: ["탭"],
    // size: "498KB",
  },
  {
    title: "스와이퍼탭",
    file: "3. swiper_tab",
    // desc: "탭 5개를 가로로 넘기는 슬라이드 탭",
    // tags: ["탭", "스와이퍼"],
    // size: "222KB",
  },
  {
    title: "모달",
    file: "4. modal",
    // desc: "버튼을 누르면 뜨는 팝업",
    // tags: ["모달"],
    // size: "506KB",
  },
  {
    title: "오디오",
    file: "5. audio",
    // desc: "재생바가 있는 오디오 2개",
    // tags: ["오디오"],
    // size: "143KB",
  },
  // {
  //   title: "서브탭",
  //   file: "7. sub_tab",
  //   desc: "탭 안에 하위 탭이 있는 구조",
  //   tags: ["탭", "서브탭"],
  //   size: "502KB",
  // },
  // {
  //   title: "고정BG",
  //   file: "8. fixedBackgroundImage",
  //   desc: "스크롤해도 배경 이미지가 고정",
  //   tags: ["배경 고정"],
  //   size: "2.3MB",
  // },
];

// 오늘 날짜 YYMMDD (예: 2026-11-10 → 261110)
const todayPrefix = () => {
  const d = new Date();
  const p2 = (n) => String(n).padStart(2, "0");
  return `${String(d.getFullYear()).slice(2)}${p2(d.getMonth() + 1)}${p2(d.getDate())}_`;
};

// "2. tab" → "tab", "8. fixedBackgroundImage" → "fixedBackgroundImage"
const defaultFolderName = (file) => file.replace(/^\d+\.\s*/, "");

const saveBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 15000);
};

const formatDate = (d) =>
  /^\d{6}$/.test(d)
    ? `${d.slice(0, 2)}년 ${d.slice(2, 4)}월 ${d.slice(4, 6)}일`
    : d;

const FileDownload = () => {
  const [selected, setSelected] = useState(templates[0].file);
  const [folderInput, setFolderInput] = useState("");
  const [contentName, setContentName] = useState("");
  const [contentCode, setContentCode] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);
  const [sizes, setSizes] = useState({});

  // ZIP 용량은 파일에서 직접 읽어 표시합니다 (ZIP을 바꿔도 자동 반영)
  useEffect(() => {
    let cancelled = false;
    const format = (bytes) =>
      bytes >= 1024 * 1024
        ? `${(bytes / 1024 / 1024).toFixed(1)}MB`
        : `${Math.round(bytes / 1024)}KB`;
    Promise.all(
      templates.map(async (t) => {
        try {
          const res = await fetch(
            `${FILE_BASE}${encodeURIComponent(t.file)}.zip`,
            {
              method: "HEAD",
            },
          );
          const len = Number(res.headers.get("content-length"));
          return res.ok && len ? [t.file, format(len)] : null;
        } catch {
          return null;
        }
      }),
    ).then((list) => {
      if (!cancelled) setSizes(Object.fromEntries(list.filter(Boolean)));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const template = templates.find((t) => t.file === selected);
  const prefix = todayPrefix();
  const folderText = folderInput.trim() || defaultFolderName(template.file);
  const folderError = invalidFolderChars(folderText)
    ? '폴더명에 \\ / : * ? " < > | 는 쓸 수 없어요.'
    : "";
  const folderName = `${prefix}${folderText}`;
  const zipName = `${folderName}.zip`;
  const [latest, ...older] = templateHistory;
  const clearStatus = () => setStatus({ type: "", text: "" });

  const handleDownload = async () => {
    const url = `${FILE_BASE}${encodeURIComponent(template.file)}.zip`;

    if (folderError) return;

    setBusy(true);
    setStatus({ type: "", text: "ZIP 만드는 중…" });
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("템플릿 파일을 찾을 수 없어요.");
      const blob = await customizeTemplate(await res.arrayBuffer(), {
        folderName,
        contentName: contentName.trim(),
        contentCode: contentCode.trim(),
      });
      saveBlob(blob, zipName);
      setStatus({ type: "ok", text: `${zipName} 다운로드를 시작했어요.` });
    } catch (err) {
      setStatus({
        type: "error",
        text: err.message || "ZIP을 만들지 못했어요.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="FileDownload">
      <div className="container">
        <ContentsTitle
          title={"템플릿 다운로드"}
          description={
            "컨텐츠명과 태깅코드를 넣으면 index.html에 미리 채워서 받을 수 있어요."
          }
        />

        {latest && (
          <div className="history">
            <div className="history-latest">
              <span className="badge">최신</span>
              <strong>{latest.version}</strong>
              <span className="changes">{latest.changes.join(" · ")}</span>
              {latest.date && (
                <span className="date">{formatDate(latest.date)}</span>
              )}
            </div>
            {older.length > 0 && (
              <details className="history-more">
                <summary>이전 업데이트 내역 {older.length}건</summary>
                <ul>
                  {older.map((h, i) => (
                    <li key={`${h.version}-${i}`}>
                      <strong>{h.version}</strong>
                      <span className="changes">{h.changes.join(" · ")}</span>
                      {h.date && (
                        <span className="date">{formatDate(h.date)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

        <div
          className="template-grid"
          role="radiogroup"
          aria-label="템플릿 선택"
        >
          {templates.map((t) => (
            <button
              type="button"
              role="radio"
              aria-checked={selected === t.file}
              key={t.file}
              className={`template-card ${selected === t.file ? "is-selected" : ""}`}
              onClick={() => {
                setSelected(t.file);
                clearStatus();
              }}
            >
              <span className="card-title">{t.title}</span>
              {t.desc && <span className="card-desc">{t.desc}</span>}
              <span className="card-meta">
                {(t.tags || []).map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
                {(t.size || sizes[t.file]) && (
                  <span className="size">{t.size || sizes[t.file]}</span>
                )}
              </span>
            </button>
          ))}
        </div>

        <div className="download-panel">
          <div className="fields">
            <label className="field">
              <span>폴더명</span>
              <div className={`prefix-input ${folderError ? "is-error" : ""}`}>
                <span className="prefix" aria-hidden="true">
                  {prefix}
                </span>
                <input
                  type="text"
                  value={folderInput}
                  placeholder={defaultFolderName(template.file)}
                  aria-label={`폴더명 (앞에 ${prefix} 자동으로 붙음)`}
                  onChange={(e) => {
                    setFolderInput(e.target.value);
                    clearStatus();
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleDownload()}
                />
              </div>
            </label>
            <label className="field">
              <span>컨텐츠명 (선택)</span>
              <input
                type="text"
                value={contentName}
                placeholder="컨텐츠명"
                onChange={(e) => {
                  setContentName(e.target.value);
                  clearStatus();
                }}
                onKeyDown={(e) => e.key === "Enter" && handleDownload()}
              />
            </label>
            <label className="field">
              <span>태깅코드 (선택)</span>
              <input
                type="text"
                value={contentCode}
                placeholder="태깅코드"
                onChange={(e) => {
                  setContentCode(e.target.value);
                  clearStatus();
                }}
                onKeyDown={(e) => e.key === "Enter" && handleDownload()}
              />
            </label>
            <button
              type="button"
              className="download-btn"
              onClick={handleDownload}
              disabled={busy || !!folderError}
            >
              {busy ? "만드는 중…" : `${template.title} 다운로드`}
            </button>
          </div>

          {folderError ? (
            <p className="hint is-error">{folderError}</p>
          ) : (
            <p className="hint">
              받을 파일 <code>{zipName}</code> · 압축을 풀면{" "}
              <code>{folderName}</code> 폴더
              {contentName.trim() || contentCode.trim()
                ? " · 입력한 값이 index.html에 채워져요"
                : ""}
            </p>
          )}
          {status.text && (
            <p
              className={`hint status ${status.type === "error" ? "is-error" : ""}`}
              role="status"
            >
              {status.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileDownload;
