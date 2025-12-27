import "./toast.css";
import ToastItem from "./ToastItem";
import type { ToastItemData } from "./useToast";

/**
 * 토스트 전체 묶음 렌더링
 */
export default function ToastContainer({ toasts }: { toasts: ToastItemData[] }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  );
}
