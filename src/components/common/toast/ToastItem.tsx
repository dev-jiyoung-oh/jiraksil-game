import type { ToastType } from "./useToast";

/**
 * 단일 토스트 컴포넌트
 */
export default function ToastItem({
  message,
  type = "info",
}: {
  message: string;
  type?: ToastType;
}) {
  return (
    <div className={`toast toast-${type}`}>
      {message}
    </div>
  );
}
