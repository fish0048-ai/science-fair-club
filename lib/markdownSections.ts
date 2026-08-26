export function isWorksheetHeading(heading: string) {
  return /學習單\s*(\d|[A-Z]|E)|筆記卡|計畫卡/.test(heading);
}

export function splitH2Sections(markdown: string) {
  const firstH2 = markdown.search(/\n##\s/);
  if (firstH2 === -1) {
    const heading = markdown.match(/^#\s+(.+)$/m)?.[1] || "";
    return [{ heading, markdown }];
  }

  const parts: { heading: string; markdown: string }[] = [];
  const preamble = markdown.slice(0, firstH2).trim();
  if (preamble) {
    parts.push({
      heading: preamble.match(/^#\s+(.+)$/m)?.[1] || "",
      markdown: preamble,
    });
  }

  const rest = markdown.slice(firstH2).trim();
  for (const block of rest.split(/\n(?=##\s)/)) {
    const heading = block.match(/^##\s+(.+)$/m)?.[1] || "";
    parts.push({ heading, markdown: block.trim() });
  }
  return parts;
}
