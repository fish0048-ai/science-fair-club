"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";

export function Sidebar() {
  const pathname = usePathname();
  const groups = Array.from(new Set(NAV.map((item) => item.group)));

  return (
    <aside className="sidebar">
      <Link href="/" className="brand">
        國中科展社團
      </Link>
      <div className="brand-sub">對齊全國科展的 17 週講義</div>
      {groups.map((group) => (
        <div key={group}>
          <div className="nav-group">{group}</div>
          {NAV.filter((item) => item.group === group).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link${pathname === item.href ? " active" : ""}`}
            >
              {item.title}
            </Link>
          ))}
        </div>
      ))}
    </aside>
  );
}
