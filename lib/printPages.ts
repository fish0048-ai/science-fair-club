/** 對齊 app/globals.css 的 @page body 邊界。 */
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
export const BODY_MARGIN_X_MM = 12;
export const BODY_MARGIN_TOP_MM = 12;
export const BODY_MARGIN_BOTTOM_MM = 16;
export const BODY_PAGE_WIDTH_MM = A4_WIDTH_MM - BODY_MARGIN_X_MM * 2;
export const BODY_PAGE_HEIGHT_MM = A4_HEIGHT_MM - BODY_MARGIN_TOP_MM - BODY_MARGIN_BOTTOM_MM;

export function pxPerMm() {
  if (typeof document === "undefined") return 96 / 25.4;
  const probe = document.createElement("div");
  probe.style.cssText = "position:absolute;left:-9999px;top:0;width:100mm;height:0;visibility:hidden;";
  document.body.appendChild(probe);
  const value = probe.offsetWidth / 100;
  probe.remove();
  return value || 96 / 25.4;
}

export function pagesForHeight(heightPx: number, pageHeightPx: number) {
  if (pageHeightPx <= 0 || heightPx <= 0) return 1;
  return Math.max(1, Math.ceil(heightPx / pageHeightPx - 1e-4));
}

/** 螢幕預覽比列印內容區寬，依寬度比例把高度換算成印刷頁數。 */
export function estimateBlockPages(el: HTMLElement, pageHeightPx: number, printWidthPx: number) {
  const rect = el.getBoundingClientRect();
  if (rect.height <= 0 || pageHeightPx <= 0) return 1;
  const width = rect.width || printWidthPx;
  const scaled = printWidthPx > 0 ? rect.height * (width / printWidthPx) : rect.height;
  return pagesForHeight(scaled, pageHeightPx);
}

export function chapterStartPages(tocPages: number, chapterPages: number[]) {
  let page = 1 + Math.max(1, tocPages);
  return chapterPages.map((count) => {
    const start = page;
    page += Math.max(1, count);
    return start;
  });
}
