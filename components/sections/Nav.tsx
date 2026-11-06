"use client";

import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { PixelIcon } from "@/components/ui/PixelIcon";
import { NAV_LINKS, SECTIONS } from "@/lib/site";

export function Logo() {
  return (
    <a
      href="#top"
      className="group inline-flex items-center gap-2.5 text-text no-underline"
      aria-label="LeadPilot — в начало страницы"
    >
      <PixelIcon name="mark" size={24} className="text-lime" />
      <span className="font-display text-[1.0625rem] font-semibold tracking-[-0.02em]">
        LeadPilot
      </span>
    </a>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg">
      <nav
        aria-label="Основная навигация"
        className="mx-auto flex h-nav max-w-page items-center justify-between gap-6 px-gutter"
      >
        <Logo />

        {/* Ссылки — группой справа, вплотную к кнопке (~28px от текста последней ссылки). */}
        <div className="flex items-center gap-4 md:max-lg:gap-5">
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex h-10 items-center rounded-lg px-2 text-[0.875rem] whitespace-nowrap text-muted no-underline lg:px-3 transition-colors duration-150 hover:text-text"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button href={`#${SECTIONS.demo}`} size="sm" className="hidden md:inline-flex">
            Попробовать демо
          </Button>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-lg text-text md:hidden"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
          </button>
        </div>
      </nav>

      <div
        id={panelId}
        hidden={!open}
        className="border-t border-line bg-bg md:hidden"
      >
        <ul className="mx-auto flex max-w-page flex-col px-gutter py-2">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="border-b border-line last:border-b-0">
              <a
                href={link.href}
                onClick={() => close(true)}
                className="flex h-12 items-center justify-between text-[1.0625rem] text-text no-underline"
              >
                {link.label}
                <PixelIcon name="arrow" size={16} className="text-muted" />
              </a>
            </li>
          ))}
        </ul>
        <div className="mx-auto max-w-page px-gutter pt-2 pb-5">
          <Button href={`#${SECTIONS.demo}`} size="lg" className="w-full" onClick={() => close(true)}>
            Попробовать демо
          </Button>
        </div>
      </div>
    </header>
  );
}
