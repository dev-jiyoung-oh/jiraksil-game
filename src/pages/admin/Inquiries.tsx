import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminInquiries } from "@/api/inquiry";
import type { InquiryDetail } from "@/types/inquiry";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import "./Admin.css";

export default function AdminInquiries() {
  const navigate = useNavigate();
  const [items, setItems] = useState<InquiryDetail[]>([]);
  const [filter, setFilter] = useState<"" | "replied" | "pending">("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminInquiries()
      .then(setItems)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = items.filter((i) => {
    if (filter === "replied") return i.hasReply;
    if (filter === "pending") return !i.hasReply;
    return true;
  });

  return (
    <div>
      <div className="admin-section-header">
        <h2>고객 문의 목록</h2>
        <select
          className="admin-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as "" | "replied" | "pending")}
        >
          <option value="">전체</option>
          <option value="pending">답변 대기</option>
          <option value="replied">답변 완료</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <p className="admin-empty">문의가 없습니다.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>날짜</th>
              <th>답변</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="admin-row"
                onClick={() => navigate(`/admin/inquiries/${item.id}`)}
              >
                <td>{item.id}</td>
                <td className="admin-content-cell">
                  {item.isPrivate && (
                    <>
                      <span aria-hidden="true">🔒 </span>
                      <span className="sr-only">비공개</span>
                    </>
                  )}
                  {item.title}
                </td>
                <td>{item.authorName}</td>
                <td>{new Date(item.createdAt).toLocaleDateString("ko-KR")}</td>
                <td>
                  <span className={`inquiry-reply-badge ${item.hasReply ? "replied" : ""}`}>
                    {item.hasReply ? "답변완료" : "대기중"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
