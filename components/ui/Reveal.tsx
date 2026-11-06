"use client";

import { useAnimate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Задержка в секундах — для ступенчатого появления соседних блоков. */
  delay?: number;
  as?: "div" | "li" | "article";
};

/**
 * Мягкое появление при скролле (один раз). Контент виден по умолчанию — и без JS,
 * и в статическом HTML: прячется только то, что после гидратации оказалось ниже экрана.
 * При prefers-reduced-motion ничего не анимируется.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: Props) {
  const [scope, animate] = useAnimate<HTMLElement>();
  const inView = useInView(scope, { once: true, margin: "0px 0px -12% 0px" });
  const reduced = useReducedMotion();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = scope.current;
    if (!el || reduced) return;
    if (el.getBoundingClientRect().top > window.innerHeight) {
      animate(el, { opacity: 0, transform: "translateY(16px)" }, { duration: 0 });
      setArmed(true);
    }
    // Однократная проверка положения при монтировании.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!armed || !inView || !scope.current) return;
    animate(
      scope.current,
      { opacity: 1, transform: "translateY(0px)" },
      { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
    );
  }, [armed, inView, animate, delay, scope]);

  return (
    <Tag ref={scope as never} className={className}>
      {children}
    </Tag>
  );
}
