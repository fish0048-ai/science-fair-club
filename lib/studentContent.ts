/** 學生講義／列印要拿掉的章節；不含「教師蓋章」這類學生作業用語。 */
export function isTeacherHeading(heading: string) {
  return /教學流程|教師備課|備課清單|總檢核|給教師|教師用|教師備註|教師頁/.test(heading);
}

function parseTableCells(line: string) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|")) return null;
  return trimmed
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

/** 上課投影／學生版：拿掉教師提示、參考答案、教師要做或要說的話。 */
export function stripTeacherCues(markdown: string) {
  const lines = markdown.split("\n");
  const kept: string[] = [];
  let skippingHint = false;
  let skippingTeacherAction = false;
  let dropColumn = -1;

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^\s*\*{0,2}教師提示/.test(line)) {
      skippingHint = true;
      skippingTeacherAction = false;
      continue;
    }
    if (skippingHint) {
      if (/^#{1,6}\s/.test(line)) skippingHint = false;
      else continue;
    }

    if (/^教師(巡堂|當堂|口述|紅筆|只)/.test(trimmed) || /^教師演示/.test(trimmed)) {
      skippingTeacherAction = true;
      if (/^教師口述/.test(trimmed)) {
        const rest = trimmed
          .replace(/^教師口述或投影[^，,]*(，)?\s*/, "")
          .replace(/^請學生/, "請");
        if (rest && rest !== trimmed) kept.push(rest);
      }
      continue;
    }
    if (skippingTeacherAction) {
      if (trimmed === "" || trimmed.startsWith("- ") || trimmed.startsWith("* ")) continue;
      skippingTeacherAction = false;
    }

    if (/^→\s/.test(trimmed)) continue;

    const cells = parseTableCells(line);
    if (cells) {
      const teacherCol = cells.findIndex((cell) => /教師做什麼/.test(cell));
      if (teacherCol >= 0) dropColumn = teacherCol;
      if (dropColumn >= 0 && cells.length > dropColumn) {
        const next = [...cells];
        next.splice(dropColumn, 1);
        kept.push(`| ${next.join(" | ")} |`);
        continue;
      }
    } else {
      dropColumn = -1;
    }

    kept.push(
      line
        .replace(/（時間不夠就教師演示[^）]*）/g, "")
        .replace(/(追問：[^\n（]*)（[^）]+）/g, "$1"),
    );
  }

  return kept.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function stripTeacherSections(markdown: string) {
  const first = markdown.search(/\n##\s/);
  if (first === -1) {
    return stripTeacherCues(markdown).trim();
  }

  const preamble = markdown.slice(0, first);
  const sections = markdown.slice(first + 1).split(/\n(?=##\s)/);
  const kept = sections.filter((section) => {
    const heading = section.match(/^##\s+(.+)$/m)?.[1] || "";
    return !isTeacherHeading(heading);
  });

  return stripTeacherCues(`${preamble}\n\n${kept.join("\n\n")}`)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function hasTeacherContent(markdown: string) {
  const headings = [...markdown.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1]);
  if (headings.some(isTeacherHeading)) return true;
  return /^\s*\*{0,2}教師提示/m.test(markdown);
}
