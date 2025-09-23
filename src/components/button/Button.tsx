"use client";

import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 子要素（ボタンラベルなど） */
  children: ReactNode;
  /** 配色バリアント */
  variant?: ButtonVariant;
  /** サイズ */
  size?: ButtonSize;
  /** 横幅いっぱいにするか */
  fullWidth?: boolean;
  /** 固定幅（例: 200 or "12rem"） */
  width?: number | string;
  /** 最小幅 */
  minWidth?: number | string;
  /** 最大幅 */
  maxWidth?: number | string;
}

/**
 * 角がない丸い（ピル型）ボタンコンポーネント
 * - 完全な丸み: border-radius: 9999px
 * - アクセシビリティ: フォーカスリング対応
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      width,
      minWidth,
      maxWidth,
      type = "button",
      disabled,
      ...rest
    },
    ref
  ) => {
    const styleFromProps = {
      width: width !== undefined ? (typeof width === "number" ? `${width}px` : width) : undefined,
      minWidth: minWidth !== undefined ? (typeof minWidth === "number" ? `${minWidth}px` : minWidth) : undefined,
      maxWidth: maxWidth !== undefined ? (typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth) : undefined,
    } as const;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={[
          styles.button,
          styles[variant],
          styles[size],
          fullWidth ? styles.fullWidth : "",
          disabled ? styles.disabled : "",
          className || "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ ...(rest.style || {}), ...styleFromProps }}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;


