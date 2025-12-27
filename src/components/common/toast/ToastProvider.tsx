import { useState, useCallback } from "react";
import type { ToastItemData, ToastOptions } from "./useToast";
import { DEFAULT_TOAST_DURATION, ToastContext } from "./useToast";
import ToastContainer from "./ToastContainer";

/**
 * 토스트 상태 관리
 */
export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Array<ToastItemData>>([]);

  const showToast = useCallback((options: ToastOptions) => {
    const id = Date.now() + Math.random();
    const toast: ToastItemData = {
      id,
      message: options.message,
      type: options.type ?? "info",
      duration: options.duration ?? DEFAULT_TOAST_DURATION,
    };

    setToasts(prev => [...prev, toast]);

    // 자동 제거
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}
