"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** Legacy/reference pages tucked behind the hidden table of contents. */
const TOC_LINKS: { label: string; href: string }[] = [
  { label: "Cinch", href: "/cinch" },
  { label: "GreenTech", href: "/greentech" },
  { label: "Solutions Builder", href: "/solutions-builder" },
  { label: "Comparison", href: "/comparison" },
  { label: "Future State", href: "/future-state" },
  { label: "Future State Visual", href: "/future-state-visual" },
];

export function HiddenTocMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open table of contents"
        aria-expanded={open}
        aria-haspopup="menu"
        className="block h-[3.3px] w-[3.3px] rounded-full bg-white shadow ring-1 ring-black/30 transition-transform hover:scale-150"
      />
      {open ? (
        <div
          role="menu"
          className="absolute left-0 top-6 z-50 min-w-[13rem] overflow-hidden rounded-lg border border-gray-700 bg-[#252526] py-1 shadow-xl"
        >
          <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
            Table of Contents
          </p>
          {TOC_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={`block px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-gray-700 text-gray-100"
                    : "text-gray-300 hover:bg-gray-700/60 hover:text-gray-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
