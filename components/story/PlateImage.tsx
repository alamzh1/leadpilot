"use client";

import { useEffect, useRef, type ImgHTMLAttributes } from "react";

/**
 * Фоновое изображение секции. Если файл не загрузился, ставит `data-img-failed` на родителя —
 * тогда CSS включает сеточный фолбэк из палитры (`.hero-plate`, `.t04-plate`, `.t04-closing`).
 * Ошибка до гидратации ловится проверкой `complete && naturalWidth === 0`.
 */
export function PlateImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    const markFailed = () => img.parentElement?.setAttribute("data-img-failed", "");
    if (img.complete && img.naturalWidth === 0) markFailed();
    img.addEventListener("error", markFailed);
    return () => img.removeEventListener("error", markFailed);
  }, []);

  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- статический экспорт, ручной srcset; alt приходит в props
  return <img ref={ref} {...props} />;
}
