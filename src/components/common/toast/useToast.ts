import { createContext, useContext } from "react";

/**
 * 토스트 기초 타입 및 훅 선언
 */
export const DEFAULT_TOAST_DURATION = 2500 as const;

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number; // ms
}

export interface ToastItemData extends ToastOptions {
  id: number;
}

export interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("ToastProvider 내부에서만 useToast를 사용할 수 있습니다.");
  }
  return ctx;
}
