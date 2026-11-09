import { useCallback, useEffect, useRef, useState } from "react";
import ContentsTitle from "../ContentsTitle";
import "./index.css";

const MODES = [
  { key: "overlay", label: "투명도", hint: "시안을 반투명하게 실사이트 위에 겹쳐요." },
  { key: "swipe", label: "슬라이더", hint: "화면을 드래그해서 왼쪽=실사이트, 오른쪽=시안으로 비교해요." },
  { key: "diff", label: "반전 차이", hint: "같은 곳은 검정, 어긋난 곳은 밝게 보여요." },
  { key: "side", label: "나란히", hint: "실사이트와 시안을 옆에 두고 같이 스크롤해요. 마우스 위치에 가로 기준선이 생겨요." },
];

const WIDTHS = [320, 375, 750];
const ZOOMS = [0.5, 0.75, 1, 1.5, 2];
const DEFAULT_H = 812;
const STORE_KEY = "overlay-url-compare";

const IS_DEV = import.meta.env.DEV;

// 작업 영역이 아닌 외부 임베드(영상, SNS, 광고 등)는 「작업 영역만 열기」 후보에서 제외
const EMBED_HOSTS = /(youtube|youtu\.be|vimeo|facebook|instagram|twitter|google|doubleclick|kakao|naver|tiktok)\./i;

// iframe 안 스크롤바 폭 (가로가 줄어들지 않도록 iframe을 그만큼 넓히고 잘라냄)
const SCROLLBAR_W = (() => {
  if (typeof document === "undefined") return 0;
  const el = document.createElement("div");
  el.style.cssText = "position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll";
  document.body.appendChild(el);
  const w = el.offsetWidth - el.clientWidth;
  el.remove();
  return w;
})();

const loadStore = () => {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
  } catch {
    return {};
  }
};
const saveStore = (v) => {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(v));
  } catch {
    /* 저장 안 돼도 동작에는 문제 없음 */
  }
};

const normalizeUrl = (v) => {
  const s = v.trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  const local = /^(localhost|127\.|192\.168\.|10\.)/i.test(s);
  return `${local ? "http" : "https"}://${s}`;
};

let seq = 0;
const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () =>
      resolve({
        id: ++seq,
        url,
        name: file.name || `붙여넣은 이미지 ${seq}`,
        w: img.naturalWidth,
        h: img.naturalHeight,
        x: 0,
        y: 0,
      });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 열 수 없어요."));
    };
    img.src = url;
  });

const imageFiles = (files) => [...(files || [])].filter((x) => x.type.startsWith("image/"));
const isField = (t) => /^(INPUT|TEXTAREA|SELECT)$/.test(t?.tagName) || t?.isContentEditable;

/* 탭 화면의 시안 슬롯 (여러 장) */
function DesignSlot({ designs, onFiles, onRemove, onClear }) {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);

  return (
    <div
      className={`slot design-slot ${over ? "is-over" : ""} ${designs.length ? "is-filled" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        onFiles(e.dataTransfer.files);
      }}
    >
      <span className="slot-label">시안 {designs.length > 0 && `${designs.length}장`}</span>
      {designs.length ? (
        <>
          <ul className="slot-list">
            {designs.map((d, i) => (
              <li key={d.id} title={`${d.name} (${d.w}×${d.h})`}>
                <img src={d.url} alt="" />
                <span className="no">{i + 1}</span>
                <button type="button" aria-label="삭제" onClick={() => onRemove(d.id)}>
                  ×
                </button>
              </li>
            ))}
            <li>
              <button type="button" className="slot-add" onClick={() => inputRef.current?.click()}>
                +
              </button>
            </li>
          </ul>
          <div className="slot-actions">
            <button type="button" onClick={onClear}>
              모두 삭제
            </button>
          </div>
        </>
      ) : (
        <button type="button" className="slot-empty" onClick={() => inputRef.current?.click()}>
          <span className="slot-plus">+</span>
          <span>이미지를 끌어오거나 클릭 · Ctrl+V</span>
          <span className="slot-sub">탭별 시안은 여러 장 한 번에 넣어도 돼요 (1x · 2x 가능)</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          onFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

const Overlay = () => {
  const stored = useState(loadStore)[0];
  const [designs, setDesigns] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [urlInput, setUrlInput] = useState(stored.url || "");
  const [url, setUrl] = useState("");
  const [useProxy, setUseProxy] = useState(!!stored.useProxy);
  const [check, setCheck] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [width, setWidth] = useState(stored.width || 375);
  const [frameH, setFrameH] = useState(null); // null = 자동
  const [mode, setMode] = useState("overlay");
  const [tool, setTool] = useState("move"); // move = 시안 이동, click = 사이트 클릭
  const [opacity, setOpacity] = useState(50);
  const [swipe, setSwipe] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [showDesign, setShowDesign] = useState(true);
  const [peek, setPeek] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isFull, setIsFull] = useState(false);
  const [pageInfo, setPageInfo] = useState(null); // { page: 입력한 페이지, frames: 안에서 찾은 작업 영역들 }
  const [finding, setFinding] = useState(false);

  const reqRef = useRef(0);
  const frameRef = useRef(null);
  const designInputRef = useRef(null);
  const stageRef = useRef(null);
  const dragRef = useRef(null); // { kind: "swipe" | "move", sx, sy, ox, oy }
  const sideRef = useRef(null);
  const [guideY, setGuideY] = useState(null);
  const isSide = mode === "side";

  // 나란히 보기: 마우스 높이에 양쪽 공통 가로 기준선
  const trackGuide = (e) => {
    const r = (sideRef.current || stageRef.current)?.getBoundingClientRect();
    if (!r) return;
    const y = (e.clientY - r.top) / zoom;
    setGuideY(y >= 0 && y <= stageH ? Math.round(y) : null);
  };

  const active = designs.find((d) => d.id === activeId) || null;

  useEffect(() => {
    saveStore({ url: urlInput, width, useProxy });
  }, [urlInput, width, useProxy]);

  const addFiles = useCallback(async (files) => {
    const list = imageFiles(files);
    if (!list.length) return;
    try {
      setError("");
      const loaded = await Promise.all(list.map(loadImage));
      setDesigns((prev) => [...prev, ...loaded]);
      setActiveId(loaded[0].id);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const removeDesign = (id) => {
    const target = designs.find((d) => d.id === id);
    if (target) URL.revokeObjectURL(target.url);
    const next = designs.filter((d) => d.id !== id);
    setDesigns(next);
    if (id === activeId) setActiveId(next[0]?.id ?? null);
  };
  const clearDesigns = () => {
    designs.forEach((d) => URL.revokeObjectURL(d.url));
    setDesigns([]);
    setActiveId(null);
    setFrameH(null);
  };

  const moveActive = useCallback(
    (fn) => {
      setDesigns((prev) => prev.map((d) => (d.id === activeId ? { ...d, ...fn(d) } : d)));
    },
    [activeId],
  );

  // 붙여넣기 (Ctrl+V) → 시안 추가
  useEffect(() => {
    const onPaste = (e) => {
      const files = [...(e.clipboardData?.items || [])]
        .filter((x) => x.type.startsWith("image/"))
        .map((x) => x.getAsFile())
        .filter(Boolean);
      if (!files.length) return;
      e.preventDefault();
      addFiles(files);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [addFiles]);

  const show = (target) => {
    setUrl(target);
    setReloadKey((k) => k + 1);
    setIsFull(true);
  };

  // 입력한 페이지 안에 iframe(작업 영역)이 있으면 그 영역을 바로 엶
  const openUrl = async (e) => {
    e?.preventDefault();
    const next = normalizeUrl(urlInput);
    if (!next) return;
    try {
      new URL(next);
    } catch {
      setError("주소 형식이 올바르지 않아요.");
      return;
    }
    setError("");
    setNotice("");
    setUrlInput(next);
    const req = ++reqRef.current;

    if (!IS_DEV) {
      setPageInfo(null);
      show(next);
      return;
    }
    setFinding(true);
    let found = [];
    try {
      const d = await (await fetch(`/__overlay/check?url=${encodeURIComponent(next)}`)).json();
      if (d.ok) found = (d.frames || []).filter((fr) => !EMBED_HOSTS.test(new URL(fr.src).host));
    } catch {
      /* 못 찾으면 입력한 주소 그대로 엶 */
    }
    if (req !== reqRef.current) return;
    setFinding(false);
    setPageInfo(found.length ? { page: next, frames: found } : null);
    show(found.length ? found[0].src : next);
  };

  // 전체 화면: 뒤 페이지 스크롤 막기
  useEffect(() => {
    if (!isFull) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isFull]);

  // 사이트(iframe)를 클릭하면 포커스가 iframe으로 넘어가 단축키가 끊기므로 바로 되돌림
  useEffect(() => {
    if (!isFull) return;
    const onBlur = () => {
      setPeek(false);
      setTimeout(() => {
        if (document.activeElement === frameRef.current) {
          frameRef.current.blur();
          window.focus();
        }
      }, 0);
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [isFull]);

  // iframe 차단 여부 확인 (개발 서버에서만)
  useEffect(() => {
    setCheck(null);
    if (!IS_DEV || !url) return;
    let alive = true;
    fetch(`/__overlay/check?url=${encodeURIComponent(url)}`)
      .then((r) => r.json())
      .then((d) => alive && setCheck(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [url]);

  // 시안은 선택한 가로폭에 맞춤 (2x 시안이면 절반으로 줄어듦)
  const scaleOf = (d) => width / d.w;
  const ratio = active ? scaleOf(active) : 1;
  // 시안마다 길이가 달라도 화면 높이가 흔들리지 않게 가장 긴 시안 기준
  const autoH = designs.length ? Math.max(...designs.map((d) => Math.round(d.h * scaleOf(d)))) : DEFAULT_H;
  const stageH = frameH ?? autoH;
  // 시안이 없으면 휴대폰처럼 iframe 안에서 스크롤, 시안이 있으면 iframe을 길게 펴서 시안과 함께 스크롤
  const scrollInside = designs.length === 0;

  const fitPageHeight = () => {
    try {
      const doc = frameRef.current?.contentDocument;
      if (!doc?.documentElement) throw new Error();
      setFrameH(Math.max(doc.documentElement.scrollHeight, doc.body?.scrollHeight || 0));
      setNotice("");
    } catch {
      setNotice("다른 도메인 페이지라 높이를 읽을 수 없어요. 프록시로 열거나 높이를 직접 입력해주세요.");
    }
  };

  // 단축키: 방향키 이동 · 1~9 시안 전환 · V/C 도구 · Space 시안만 보기 · Esc 나가기
  useEffect(() => {
    if (!isFull) return;
    const down = (e) => {
      if (e.key === "Escape") {
        setIsFull(false);
        return;
      }
      if (isField(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      const step = e.shiftKey ? 10 : 1;
      const map = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
      if (map[e.key] && active) {
        e.preventDefault();
        const [dx, dy] = map[e.key];
        moveActive((d) => ({ x: d.x + dx, y: d.y + dy }));
      } else if (/^[1-9]$/.test(e.key) && designs[+e.key - 1]) {
        setActiveId(designs[+e.key - 1].id);
      } else if (e.key === "v" || e.key === "V") {
        setTool("move");
      } else if (e.key === "c" || e.key === "C") {
        setTool("click");
      } else if (e.code === "Space") {
        e.preventDefault();
        setPeek(true);
      }
    };
    const up = (e) => {
      if (e.code === "Space") setPeek(false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [isFull, active, designs, moveActive]);

  // 드래그: 슬라이더 선 → 비교 위치, 그 외 → 선택한 시안 이동
  const onPointerDown = (kind) => (e) => {
    if (kind === "move" && !active) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { kind, sx: e.clientX, sy: e.clientY, ox: active?.x || 0, oy: active?.y || 0 };
    if (kind === "swipe") onPointerMove(e);
  };
  const onPointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag) return;
    if (drag.kind === "swipe") {
      const r = stageRef.current?.getBoundingClientRect();
      if (r) setSwipe(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
    } else {
      // 기본은 세로(Y)만 이동 — 손떨림으로 X가 틀어지지 않게. Alt(Option)를 누르면 자유 이동
      const dx = e.altKey ? Math.round((e.clientX - drag.sx) / zoom) : 0;
      const dy = Math.round((e.clientY - drag.sy) / zoom);
      moveActive(() => ({ x: drag.ox + dx, y: drag.oy + dy }));
    }
  };
  const endPointer = () => {
    dragRef.current = null;
  };
  const pointerProps = (kind) => ({
    onPointerDown: onPointerDown(kind),
    onPointerMove,
    onPointerUp: endPointer,
    onPointerCancel: endPointer,
  });

  const frameSrc = url ? (useProxy ? `/__overlay/proxy?url=${encodeURIComponent(url)}` : url) : "";
  const modeInfo = MODES.find((m) => m.key === mode);

  const layerStyle = peek
    ? {}
    : {
        opacity: mode === "overlay" ? opacity / 100 : 1,
        mixBlendMode: mode === "diff" ? "difference" : "normal",
        clipPath: mode === "swipe" ? `inset(0 0 0 ${swipe}%)` : "none",
      };

  const shortPath = (src) => {
    try {
      const p = new URL(src).pathname.split("/").filter(Boolean);
      return p.slice(-2).join("/") || src;
    } catch {
      return src;
    }
  };

  const urlForm = (
    <form className="url-form" onSubmit={openUrl}>
      <div className="url-row">
        <input
          type="text"
          value={urlInput}
          placeholder="https://m.example.com 또는 localhost:5500/index.html"
          onChange={(e) => setUrlInput(e.target.value)}
        />
        <button type="submit" className="url-open" disabled={finding}>
          {finding
            ? "작업 영역 찾는 중…"
            : isFull && url && normalizeUrl(urlInput) === (pageInfo?.page || url)
              ? "새로고침"
              : "열기"}
        </button>
      </div>
      <label className={`ctrl check ${IS_DEV ? "" : "is-disabled"}`}>
        <input
          type="checkbox"
          checked={useProxy && IS_DEV}
          disabled={!IS_DEV}
          onChange={(e) => {
            setUseProxy(e.target.checked);
            if (url) setReloadKey((k) => k + 1);
          }}
        />
        <span>프록시로 열기</span>
        {!isFull && (
          <em className="sub">{IS_DEV ? "iframe 차단 사이트용 · 모바일 UA로 요청" : "npm run dev 에서만 사용 가능"}</em>
        )}
      </label>
    </form>
  );

  const notices = (
    <>
      {error && <p className="error">{error}</p>}
      {check?.ok && check.blocked && !useProxy && (
        <p className="warn">
          이 사이트는 다른 페이지 안에 띄우는 것을 막고 있어요
          {check.xfo ? ` (X-Frame-Options: ${check.xfo})` : " (CSP frame-ancestors)"}.{" "}
          <button
            type="button"
            className="mini"
            onClick={() => {
              setUseProxy(true);
              setReloadKey((k) => k + 1);
            }}
          >
            프록시로 열기
          </button>
        </p>
      )}
      {pageInfo && (
        <div className="frames">
          <span>
            페이지 안 작업 영역(iframe)을 열었어요
            {pageInfo.frames.length > 1 ? ` · ${pageInfo.frames.length}개 중 선택:` : ` · ${shortPath(url)}`}
          </span>
          {pageInfo.frames.length > 1 &&
            pageInfo.frames.map((fr) => (
              <button
                key={fr.src}
                type="button"
                className={`mini ${fr.src === url ? "accent" : ""}`}
                title={fr.src}
                onClick={() => show(fr.src)}
              >
                {fr.title ? `${fr.title} · ` : ""}
                {shortPath(fr.src)}
              </button>
            ))}
        </div>
      )}
    </>
  );

  return (
    <div className="Overlay">
      <div className="container">
        <ContentsTitle
          title={"시안 검수"}
          description={"피그마 시안을 실사이트 위에 겹쳐서 어긋난 곳을 찾아요. 열기를 누르면 전체 화면으로 비교해요."}
        />

        <div className="slots">
          <DesignSlot designs={designs} onFiles={addFiles} onRemove={removeDesign} onClear={clearDesigns} />
          <div className={`slot url-slot ${url ? "is-filled" : ""}`}>
            <span className="slot-label">실사이트</span>
            {urlForm}
          </div>
        </div>

        {!isFull && notices}
        {!isFull && url && (
          <button type="button" className="reopen" onClick={() => setIsFull(true)}>
            검수 화면 다시 열기
          </button>
        )}

        <ul className="tip-list">
          <li>페이지 주소를 넣으면 안의 작업 영역(iframe)을 찾아서 바로 열어요</li>
          <li>탭별 시안은 여러 장 넣고 1~9로 전환</li>
          <li>C 사이트 클릭 · V 시안 이동(드래그는 세로만, Alt+드래그 자유 이동)</li>
          <li>방향키 1px · Shift+방향키 10px</li>
          <li>Space 누르는 동안 시안만 보기</li>
          <li>Esc 나가기</li>
        </ul>
      </div>

      {isFull && url && (
        <div className="overlay-full">
          <div className="toolbar">
            <div className="full-row">
              <strong className="full-title">시안 검수</strong>
              {urlForm}
              <button type="button" className="full-close" onClick={() => setIsFull(false)}>
                나가기 <kbd>Esc</kbd>
              </button>
            </div>

            <div className="full-row">
              <div className="modes tools">
                <button
                  type="button"
                  className={tool === "move" ? "active" : ""}
                  onClick={() => setTool("move")}
                  title="드래그로 시안을 위아래로 옮겨요 (Alt+드래그는 자유 이동)"
                >
                  ✥ 시안 이동 <kbd>V</kbd>
                </button>
                <button
                  type="button"
                  className={tool === "click" ? "active" : ""}
                  onClick={() => setTool("click")}
                  title="탭·버튼 등 사이트를 직접 눌러요"
                >
                  👆 사이트 클릭 <kbd>C</kbd>
                </button>
              </div>

              <div className="modes" role="tablist">
                {MODES.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    className={mode === m.key ? "active" : ""}
                    title={m.hint}
                    onClick={() => setMode(m.key)}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="controls">
                {mode === "overlay" && (
                  <label className="ctrl">
                    <span>투명도</span>
                    <input type="range" min="0" max="100" value={opacity} onChange={(e) => setOpacity(+e.target.value)} />
                    <em>{opacity}%</em>
                  </label>
                )}
                {mode === "swipe" && (
                  <label className="ctrl">
                    <span>위치</span>
                    <input type="range" min="0" max="100" value={swipe} onChange={(e) => setSwipe(+e.target.value)} />
                    <em>{Math.round(swipe)}%</em>
                  </label>
                )}

                <div className="ctrl">
                  <span>가로</span>
                  <div className="presets">
                    {WIDTHS.map((w) => (
                      <button key={w} type="button" className={width === w ? "active" : ""} onClick={() => setWidth(w)}>
                        {w}
                      </button>
                    ))}
                  </div>
                  <label className="num">
                    <input type="number" value={width} onChange={(e) => setWidth(Math.max(200, +e.target.value || 375))} />
                  </label>
                </div>

                <div className="ctrl">
                  <span>높이</span>
                  <label className="num wide">
                    <input
                      type="number"
                      value={stageH}
                      onChange={(e) => setFrameH(Math.max(100, +e.target.value || DEFAULT_H))}
                    />
                  </label>
                  <button type="button" className="mini" onClick={fitPageHeight}>
                    페이지 높이
                  </button>
                  {frameH !== null && (
                    <button type="button" className="mini" onClick={() => setFrameH(null)}>
                      {designs.length ? "시안 높이" : "기본"}
                    </button>
                  )}
                </div>

                <label className="ctrl">
                  <span>확대</span>
                  <select value={zoom} onChange={(e) => setZoom(+e.target.value)}>
                    {ZOOMS.map((z) => (
                      <option key={z} value={z}>
                        {z * 100}%
                      </option>
                    ))}
                  </select>
                </label>

                <label className="ctrl check">
                  <input type="checkbox" checked={showDesign} onChange={(e) => setShowDesign(e.target.checked)} />
                  <span>시안 보이기</span>
                </label>
              </div>
            </div>

            <div className="full-notes">
              <p className="info">
                {tool === "click"
                  ? "사이트 클릭 중: 탭을 눌러 화면을 바꾼 뒤, 왼쪽에서 그 탭의 시안을 고르세요(1~9). 시안을 옮기려면 V."
                  : `${modeInfo.hint} 드래그하면 시안이 위아래로만 움직여요(Alt+드래그는 자유 이동).`}
                {active &&
                  ` · 시안 ${active.w}px → ${width}px (${Math.round(ratio * 1000) / 1000}배)${active.w / width === 2 ? " · 2x 시안" : ""}`}
                {!designs.length && " · 시안이 없어서 휴대폰 화면처럼 안에서 스크롤돼요. 시안을 왼쪽에 넣으세요."}
              </p>
              {notice && <p className="warn">{notice}</p>}
              {notices}
            </div>
          </div>

          <div className="full-body">
            <aside
              className="layers"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
            >
              <div className="layers-head">
                <strong>시안 {designs.length}장</strong>
                <button type="button" className="mini accent" onClick={() => designInputRef.current?.click()}>
                  + 추가
                </button>
                <input
                  ref={designInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => {
                    addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>

              {designs.length === 0 ? (
                <button type="button" className="layers-empty" onClick={() => designInputRef.current?.click()}>
                  탭별 시안 이미지를
                  <br />
                  끌어다 놓거나 Ctrl+V
                </button>
              ) : (
                <ol className="layer-list">
                  {designs.map((d, i) => (
                    <li key={d.id} className={d.id === activeId ? "active" : ""}>
                      <button type="button" className="layer-pick" onClick={() => setActiveId(d.id)}>
                        <span className="no">{i < 9 ? i + 1 : "·"}</span>
                        <img src={d.url} alt="" />
                        <span className="layer-info">
                          <strong title={d.name}>{d.name}</strong>
                          <em>
                            X {d.x} · Y {d.y}
                          </em>
                        </span>
                      </button>
                      <button type="button" className="layer-del" aria-label="삭제" onClick={() => removeDesign(d.id)}>
                        ×
                      </button>
                    </li>
                  ))}
                </ol>
              )}

              {active && (
                <div className="layer-pos">
                  <span>선택한 시안 위치</span>
                  <div>
                    <label className="num">
                      X
                      <input
                        type="number"
                        value={active.x}
                        onChange={(e) => moveActive(() => ({ x: +e.target.value || 0 }))}
                      />
                    </label>
                    <label className="num">
                      Y
                      <input
                        type="number"
                        value={active.y}
                        onChange={(e) => moveActive(() => ({ y: +e.target.value || 0 }))}
                      />
                    </label>
                    <button type="button" className="mini" onClick={() => moveActive(() => ({ x: 0, y: 0 }))}>
                      초기화
                    </button>
                  </div>
                </div>
              )}
            </aside>

            <div
              className="viewer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
            >
              <div
                className={`pair ${isSide ? "is-side" : ""}`}
                onPointerMove={isSide ? trackGuide : undefined}
                onPointerLeave={isSide ? () => setGuideY(null) : undefined}
              >
                <div className="pane">
                  {isSide && <p className="pane-label">실사이트</p>}
                  <div ref={stageRef} className="stage" style={{ width, height: stageH, zoom }}>
                    <iframe
                      key={`${reloadKey}-${frameSrc}`}
                      ref={frameRef}
                      src={frameSrc}
                      title="실사이트"
                      scrolling={scrollInside ? "auto" : "no"}
                      style={{ width: scrollInside ? width + SCROLLBAR_W : width, height: stageH }}
                    />

                    {isSide && guideY !== null && <div className="guide" style={{ top: guideY }} />}

                    {!isSide && active && showDesign && (
                      <div className="design-layer" style={layerStyle}>
                        <img
                          src={active.url}
                          alt=""
                          style={{ width: active.w * ratio, transform: `translate(${active.x}px, ${active.y}px)` }}
                        />
                      </div>
                    )}

                    {tool === "move" && active && <div className="capture is-move" {...pointerProps("move")} />}

                    {mode === "swipe" && active && showDesign && !peek && (
                      <div className="swipe-line" style={{ left: `${swipe}%` }} {...pointerProps("swipe")}>
                        <span />
                      </div>
                    )}
                  </div>
                </div>

                {isSide && active && (
                  <div className="pane">
                    <p className="pane-label" title={active.name}>
                      시안 · {active.name}
                    </p>
                    <div ref={sideRef} className="stage design-pane" style={{ width, height: stageH, zoom }}>
                      <img
                        src={active.url}
                        alt=""
                        style={{ width: active.w * ratio, transform: `translate(${active.x}px, ${active.y}px)` }}
                      />
                      {guideY !== null && <div className="guide" style={{ top: guideY }} />}
                      {tool === "move" && <div className="capture is-move" {...pointerProps("move")} />}
                    </div>
                  </div>
                )}
              </div>
              {peek && !isSide && <span className="peek-badge">시안만 보는 중</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overlay;
