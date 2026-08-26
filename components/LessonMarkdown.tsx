"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { isWorksheetHeading, splitH2Sections } from "@/lib/markdownSections";

export function LessonMarkdown({
  markdown,
  className,
}: {
  markdown: string;
  className?: string;
}) {
  const sections = splitH2Sections(markdown);

  return (
    <article className={className}>
      {sections.map((section, index) => {
        const body = (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.markdown}</ReactMarkdown>
        );
        if (isWorksheetHeading(section.heading)) {
          return (
            <section className="worksheet" key={`${section.heading}-${index}`} aria-label={section.heading}>
              {body}
            </section>
          );
        }
        return (
          <div className="md-block" key={`${section.heading}-${index}`}>
            {body}
          </div>
        );
      })}
    </article>
  );
}
