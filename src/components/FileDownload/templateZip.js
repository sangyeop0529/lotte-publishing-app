// 템플릿 ZIP을 브라우저 안에서 고쳐서 새 ZIP으로 만드는 도구 (외부 라이브러리 없음)
// - index.html의 컨텐츠명/태깅코드 자리 채우기
// - 압축을 풀었을 때 나오는 맨 위 폴더 이름 바꾸기 (예: "2. tab" → "261109_크리스마스")
// - 폴더명 html_999999sn 은 frame_layout이 인식하는 고정값이라 바꾸지 않습니다
// 바뀌지 않은 파일은 압축된 데이터를 그대로 복사하므로 용량과 화질이 원본과 같습니다.

const PLACEHOLDER = "html_999999sn";
const utf8 = new TextDecoder("utf-8");
const enc = new TextEncoder();

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

const crc32 = (u8) => {
  let c = 0xffffffff;
  for (let i = 0; i < u8.length; i++) c = CRC_TABLE[(c ^ u8[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

// ZIP 읽기: 중앙 디렉터리 기준으로 항목 목록을 만듭니다
const readZip = (buffer) => {
  const u8 = new Uint8Array(buffer);
  const dv = new DataView(buffer);
  let eocd = -1;
  for (let i = u8.length - 22; i >= Math.max(0, u8.length - 65557); i--) {
    if (dv.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("ZIP 파일을 읽을 수 없어요.");

  const count = dv.getUint16(eocd + 10, true);
  let p = dv.getUint32(eocd + 16, true);
  const entries = [];
  for (let n = 0; n < count; n++) {
    if (dv.getUint32(p, true) !== 0x02014b50) throw new Error("ZIP 구조가 올바르지 않아요.");
    const flags = dv.getUint16(p + 8, true);
    const method = dv.getUint16(p + 10, true);
    const time = dv.getUint16(p + 12, true);
    const date = dv.getUint16(p + 14, true);
    const crc = dv.getUint32(p + 16, true);
    const csize = dv.getUint32(p + 20, true);
    const usize = dv.getUint32(p + 24, true);
    const nameLen = dv.getUint16(p + 28, true);
    const extraLen = dv.getUint16(p + 30, true);
    const commentLen = dv.getUint16(p + 32, true);
    const localOffset = dv.getUint32(p + 42, true);
    const name = utf8.decode(u8.subarray(p + 46, p + 46 + nameLen));

    const lNameLen = dv.getUint16(localOffset + 26, true);
    const lExtraLen = dv.getUint16(localOffset + 28, true);
    const start = localOffset + 30 + lNameLen + lExtraLen;

    entries.push({
      name,
      flags,
      method,
      time,
      date,
      crc,
      csize,
      usize,
      data: u8.subarray(start, start + csize),
    });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
};

const inflate = async (entry) => {
  if (entry.method === 0) return entry.data;
  if (entry.method !== 8) throw new Error(`지원하지 않는 압축 방식이에요: ${entry.name}`);
  const stream = new Blob([entry.data])
    .stream()
    .pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
};

// ZIP 쓰기: 바뀐 파일은 무압축, 나머지는 원래 압축 데이터 그대로
const writeZip = (entries) => {
  const parts = [];
  const central = [];
  let offset = 0;
  for (const e of entries) {
    const nameBytes = enc.encode(e.name);
    const flags = 0x0800; // 파일명 UTF-8
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, flags, true);
    local.setUint16(8, e.method, true);
    local.setUint16(10, e.time, true);
    local.setUint16(12, e.date, true);
    local.setUint32(14, e.crc, true);
    local.setUint32(18, e.csize, true);
    local.setUint32(22, e.usize, true);
    local.setUint16(26, nameBytes.length, true);
    parts.push(new Uint8Array(local.buffer), nameBytes, e.data);

    const cd = new DataView(new ArrayBuffer(46));
    cd.setUint32(0, 0x02014b50, true);
    cd.setUint16(4, 20, true);
    cd.setUint16(6, 20, true);
    cd.setUint16(8, flags, true);
    cd.setUint16(10, e.method, true);
    cd.setUint16(12, e.time, true);
    cd.setUint16(14, e.date, true);
    cd.setUint32(16, e.crc, true);
    cd.setUint32(20, e.csize, true);
    cd.setUint32(24, e.usize, true);
    cd.setUint16(28, nameBytes.length, true);
    cd.setUint32(38, e.name.endsWith("/") ? 0x10 : 0, true);
    cd.setUint32(42, offset, true);
    central.push(new Uint8Array(cd.buffer), nameBytes);

    offset += 30 + nameBytes.length + e.data.length;
  }
  const cdSize = central.reduce((s, c) => s + c.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, entries.length, true);
  end.setUint16(10, entries.length, true);
  end.setUint32(12, cdSize, true);
  end.setUint32(16, offset, true);
  return new Blob([...parts, ...central, new Uint8Array(end.buffer)], {
    type: "application/zip",
  });
};

const escapeJsString = (value, quote) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(new RegExp(quote, "g"), `\\${quote}`)
    .replace(/\r?\n/g, " ")
    .replace(/<\/script/gi, "<\\/script");

const fillTodo = (html, key, placeholder, value) => {
  if (!value) return html;
  const re = new RegExp(`(const ${key} = )(['"])${placeholder}\\2;`);
  return html.replace(re, (_, head, q) => `${head}${q}${escapeJsString(value, q)}${q};`);
};

// 폴더명에 쓸 수 없는 문자 확인 (윈도우·맥 공통)
export const invalidFolderChars = (name) => /[\\/:*?"<>|]/.test(name);

export const customizeTemplate = async (buffer, { contentName, contentCode, folderName }) => {
  const out = [];
  let top = null;

  for (const e of readZip(buffer)) {
    // 맥 압축 찌꺼기는 빼고 담습니다
    if (e.name.startsWith("__MACOSX/") || e.name.endsWith(".DS_Store")) continue;

    const isIndex = e.name.endsWith(`/${PLACEHOLDER}/index.html`);
    // 맨 위 폴더 이름만 바꾸고, 그 아래(html_999999sn 등)는 그대로 둡니다
    if (top === null) top = e.name.split("/")[0];
    const name =
      folderName && e.name.split("/")[0] === top
        ? folderName + e.name.slice(top.length)
        : e.name;

    if (isIndex && (contentName || contentCode)) {
      let text = utf8.decode(await inflate(e));
      text = fillTodo(text, "contentName", "컨텐츠명", contentName);
      text = fillTodo(text, "contentCode", "태깅코드", contentCode);
      const data = enc.encode(text);
      out.push({ ...e, name, method: 0, data, crc: crc32(data), csize: data.length, usize: data.length });
    } else {
      out.push({ ...e, name });
    }
  }
  return writeZip(out);
};
