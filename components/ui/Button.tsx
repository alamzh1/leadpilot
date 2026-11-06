import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost";
type Size = "md" | "sm";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type AnchorProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string };
type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined };

export type ButtonProps = AnchorProps | NativeButtonProps;

/**
 * Кнопка в пиксельной грамматике: с `href` — ссылка `<a>`, без — `<button>`.
 * Основная — лайм со ступенчатым углом (одна на зону видимости), ghost — рамка 1px.
 */
export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant, size, children, className, ...rest } = props;
    return (
      <a {...rest} className={buttonClass(variant, size, className)}>
        <span className="px-btn__face">{children}</span>
      </a>
    );
  }
  const { variant, size, children, className, type, ...rest } = props;
  return (
    <button {...rest} type={type ?? "button"} className={buttonClass(variant, size, className)}>
      <span className="px-btn__face">{children}</span>
    </button>
  );
}

function buttonClass(variant: Variant = "primary", size: Size = "md", extra?: string): string {
  return ["px-btn", `px-btn--${variant}`, size === "sm" ? "px-btn--sm" : "", extra ?? ""]
    .filter(Boolean)
    .join(" ");
}
