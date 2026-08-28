import type { Slide, SlideKind } from "./slides";

export type ClassArt = {
  src: string;
  alt: string;
};

type ArtEntry = ClassArt & {
  kinds?: SlideKind[];
  keywords: string[];
};

const CATALOG: ArtEntry[] = [
  {
    src: "/class/fair.jpg",
    alt: "科展現場：空白海報、顯微鏡與研究日誌",
    keywords: ["科展", "評審", "賽制", "全國", "科別", "海報", "優勝", "展示及表達", "總綱", "發表", "模擬評審"],
  },
  {
    src: "/class/inquiry.jpg",
    alt: "從觀察校園現象提出可檢驗的問題",
    keywords: ["問題", "探究", "觀察", "好奇", "假設", "五條件", "推論", "定題", "好問題", "選題", "漏斗", "題型", "甄選", "定案", "計畫", "模擬", "模型", "預測", "凍結"],
  },
  {
    src: "/class/variables.jpg",
    alt: "實驗設計：一次只改一件事",
    keywords: ["變因", "對照", "實驗設計", "操作", "應變", "控制", "水平", "重複"],
  },
  {
    src: "/class/measure.jpg",
    alt: "測量工具、碼錶與安全護目鏡",
    keywords: ["測量", "誤差", "精度", "單位", "安全", "護目", "碼錶", "尺", "紅燈", "預實驗", "預試"],
  },
  {
    src: "/class/journal.jpg",
    alt: "成冊研究日誌與誠實紀錄",
    keywords: ["日誌", "倫理", "引用", "APA", "抄襲", "契約", "手寫", "文獻引用", "學習單", "口試"],
  },
  {
    src: "/class/literature.jpg",
    alt: "用電腦檢索歷屆科展與文獻",
    keywords: ["文獻", "檢索", "科教館", "筆記卡", "前人", "資料庫", "拆解"],
  },
  {
    src: "/class/data.jpg",
    alt: "把原始數據畫成圖表",
    keywords: ["數據", "圖表", "統計", "平均", "全距", "長條", "折線", "散佈", "試算", "變異數", "ANOVA", "檢定", "交互作用", "誤差線", "討論", "限制", "驗證", "程式"],
  },
  {
    src: "/class/helicopter.jpg",
    alt: "紙直升機迷你探究",
    keywords: ["直升機", "迷你探究", "迷你", "紙直", "投放", "迴紋針", "模板"],
  },
  {
    src: "/class/activity.jpg",
    alt: "小組討論與課堂活動",
    kinds: ["activity"],
    keywords: ["活動", "分組", "貼", "診所", "對決", "翻譯官", "病例", "示範"],
  },
  {
    src: "/class/homework.jpg",
    alt: "把研究日誌帶回家繼續寫",
    kinds: ["homework"],
    keywords: ["作業", "回家"],
  },
  {
    src: "/class/myth.jpg",
    alt: "分辨科學研究與科學展示迷思",
    kinds: ["myth"],
    keywords: ["迷思", "澄清", "科學遊戲", "火山"],
  },
  {
    src: "/class/goals.jpg",
    alt: "本週學習目標與探究路徑",
    kinds: ["goals", "flow"],
    keywords: ["學習目標", "能夠", "流程"],
  },
];

const KIND_FALLBACK: Record<SlideKind, string> = {
  title: "/class/fair.jpg",
  goals: "/class/goals.jpg",
  flow: "/class/goals.jpg",
  lecture: "/class/inquiry.jpg",
  activity: "/class/activity.jpg",
  worksheet: "/class/journal.jpg",
  homework: "/class/homework.jpg",
  myth: "/class/myth.jpg",
  teacher: "/class/journal.jpg",
  other: "/class/fair.jpg",
};

function scoreEntry(entry: ArtEntry, hay: string, kind: SlideKind) {
  let score = 0;
  if (entry.kinds?.includes(kind)) score += 5;
  for (const keyword of entry.keywords) {
    if (hay.includes(keyword)) score += 3;
  }
  return score;
}

export function pickClassArt(slide: Pick<Slide, "kind" | "heading" | "markdown">): ClassArt {
  const hay = `${slide.heading}\n${slide.markdown}`.slice(0, 1400);
  let best = CATALOG[0];
  let bestScore = -1;
  for (const entry of CATALOG) {
    const score = scoreEntry(entry, hay, slide.kind);
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }
  if (bestScore <= 0) {
    const src = KIND_FALLBACK[slide.kind];
    const found = CATALOG.find((entry) => entry.src === src) || best;
    return { src: found.src, alt: found.alt };
  }
  return { src: best.src, alt: best.alt };
}

export function pickClassArtForHref(href: string, title: string): ClassArt {
  return pickClassArt({ kind: "other", heading: title, markdown: `${href} ${title}` });
}
