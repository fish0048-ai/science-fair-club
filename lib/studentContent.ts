/** 學生講義／列印要拿掉的章節；不含「教師蓋章」這類學生作業用語。 */
export function isTeacherHeading(heading: string) {
  return /教學流程|教師備課|備課清單|總檢核|給教師|教師用|教師備註|教師頁/.test(heading);
}

function stripInlineTeacherNotes(markdown: string) {
  const lines = markdown.split("\n");
  const kept: string[] = [];
  let skipping = false;

  for (const line of lines) {
    if (/^\s*\*{0,2}教師提示/.test(line)) {
      skipping = true;
      continue;
    }
    if (skipping) {
      if (/^#{1,6}\s/.test(line)) skipping = false;
      else continue;
    }
    kept.push(line);
  }

  return kept.join("\n");
}

export function stripTeacherSections(markdown: string) {
  const first = markdown.search(/\n##\s/);
  if (first === -1) {
    return stripInlineTeacherNotes(markdown).trim();
  }

  const preamble = markdown.slice(0, first);
  const sections = markdown.slice(first + 1).split(/\n(?=##\s)/);
  const kept = sections.filter((section) => {
    const heading = section.match(/^##\s+(.+)$/m)?.[1] || "";
    return !isTeacherHeading(heading);
  });

  return stripInlineTeacherNotes(`${preamble}\n\n${kept.join("\n\n")}`)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function hasTeacherContent(markdown: string) {
  const headings = [...markdown.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1]);
  if (headings.some(isTeacherHeading)) return true;
  return /^\s*\*{0,2}教師提示/m.test(markdown);
}
