import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed"> & {
  selected?: boolean;
  children: ReactNode;
};

/** Переключаемый чип в пиксельной грамматике (`aria-pressed`). */
export function Chip({ selected = false, className, children, type, ...rest }: Props) {
  return (
    <button
      {...rest}
      type={type ?? "button"}
      aria-pressed={selected}
      className={["px-chip", className ?? ""].filter(Boolean).join(" ")}
    >
      {children}
    </button>
  );
}
