import { isTeacherHeading } from "./studentContent";

export type SlideKind =
  | "title"
  | "goals"
  | "flow"
  | "lecture"
  | "activity"
  | "worksheet"
  | "homework"
  | "myth"
  | "teacher"
  | "other";

export type Slide = {
  heading: string;
  markdown: string;
  kind: SlideKind;
};

export type FlowStep = {
  start: number;
  end: number;
  activity: string;
  note: string;
};

export type Lesson = {
  slides: Slide[];
  flow: FlowStep[];
};

function kindFromHeading(heading: string): SlideKind {
  if (/學習目標/.test(heading)) return "goals";
  if (/教學流程/.test(heading)) return "flow";
  if (/核心講義/.test(heading)) return "lecture";
  if (/課堂活動|討論題|實作站|練習題/.test(heading)) return "activity";
  if (/學習單|筆記卡|計畫卡/.test(heading) && !/附錄 B/.test(heading)) return "worksheet";
  if (/作業/.test(heading)) return "homework";
  if (/迷思/.test(heading)) return "myth";
  if (isTeacherHeading(heading)) return "teacher";
  return "other";
}

export function parseFlow(markdown: string): FlowStep[] {
  const steps: FlowStep[] = [];
  const row =
    /^\|\s*(\d+)\s*[–\-〜~]\s*(\d+)\s*\|\s*([^|\n]+?)\s*(?:\|\s*([^|\n]*?)\s*)?\|?\s*$/gm;
  let match: RegExpExecArray | null;
  while ((match = row.exec(markdown))) {
    const activity = match[3].replace(/\s+/g, " ").trim();
    if (!activity || activity === "活動" || /時間/.test(activity)) continue;
    steps.push({
      start: Number(match[1]),
      end: Number(match[2]),
      activity,
      note: (match[4] || "").replace(/\s+/g, " ").trim(),
    });
  }
  return steps;
}

function pushSection(slides: Slide[], heading: string, markdown: string, kind: SlideKind) {
  const body = markdown.replace(/^#{1,3}\s+.+\n/, "").trim();
  if (!body && kind !== "title") return;
  slides.push({ heading, markdown, kind });
}

export function parseLesson(markdown: string, title: string): Lesson {
  const slides: Slide[] = [];
  const firstH2 = markdown.search(/\n##\s/);
  const preamble = (firstH2 === -1 ? markdown : markdown.slice(0, firstH2)).trim();
  if (preamble) {
    slides.push({ heading: title, markdown: preamble, kind: "title" });
  }

  if (firstH2 === -1) {
    return { slides, flow: parseFlow(markdown) };
  }

  const sections = markdown.slice(firstH2 + 1).split(/\n(?=##\s)/);
  for (const section of sections) {
    const heading = section.match(/^##\s+(.+)$/m)?.[1]?.trim() || title;
    const kind = kindFromHeading(heading);
    const shouldSplit = (kind === "lecture" || kind === "activity") && /\n###\s/.test(section);
    if (!shouldSplit) {
      pushSection(slides, heading, section.trim(), kind);
      continue;
    }

    const pieces = section.split(/\n(?=###\s)/);
    const intro = pieces[0].trim();
    const introBody = intro.replace(/^##\s+.+\n?/, "").trim();
    if (introBody.length > 30) {
      pushSection(slides, heading, intro, kind);
    }
    for (const piece of pieces.slice(1)) {
      const sub = piece.match(/^###\s+(.+)$/m)?.[1]?.trim() || heading;
      pushSection(slides, `${heading}｜${sub}`, piece.trim(), kind);
    }
  }

  return { slides, flow: parseFlow(markdown) };
}

export function currentFlowStep(flow: FlowStep[], elapsedMinutes: number) {
  return flow.find((step) => elapsedMinutes >= step.start && elapsedMinutes < step.end) || null;
}
