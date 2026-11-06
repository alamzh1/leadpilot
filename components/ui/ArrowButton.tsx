import type { ButtonHTMLAttributes } from "react";
import { PixelIcon } from "./PixelIcon";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  direction: "prev" | "next";
  /** Подпись для скринридера: что именно листает кнопка. */
  label: string;
};

/** Квадратная скруглённая кнопка-стрелка для каруселей и переключателей шагов. */
export function ArrowButton({ direction, label, className, type, ...rest }: Props) {
  return (
    <button
      {...rest}
      type={type ?? "button"}
      aria-label={label}
      className={["px-iconbtn", className ?? ""].filter(Boolean).join(" ")}
    >
      <PixelIcon name="arrow" size={16} className={direction === "prev" ? "-scale-x-100" : undefined} />
    </button>
  );
}
