import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInquiries } from "@/api/inquiry";
import type { InquiryListItem } from "@/types/inquiry";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import "./Inquiry.css";

export default function InquiryList() {
  const navigate = useNavigate();
  const [items, setItems] = useState<InquiryListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getInquiries()
      .then(setItems)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="inquiry-list-header">
        <h1>고객 문의</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/inquiry/new")}
        >
          문의 작성
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <p className="inquiry-empty">아직 문의가 없습니다.</p>
      ) : (
        <table className="inquiry-table">
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
            {items.map((item) => (
              <tr
                key={item.id}
                className="inquiry-row"
                onClick={() => navigate(`/inquiry/${item.id}`)}
              >
                <td>{item.id}</td>
                <td className="inquiry-title-cell">
                  {item.isPrivate && <span className="inquiry-lock">🔒</span>}
                  {item.isPrivate ? "비밀글입니다." : item.title}
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
