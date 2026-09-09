import { useState, useEffect } from "react";
import { getAdminSuggestions } from "@/api/suggest";
import { SUGGESTION_GAME_TYPE_LABELS, type SuggestionDto, type SuggestionGameType } from "@/types/suggest";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import "./Admin.css";

export default function AdminSuggestions() {
  const [items, setItems] = useState<SuggestionDto[]>([]);
  const [filter, setFilter] = useState<SuggestionGameType | "">("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminSuggestions()
      .then(setItems)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = filter ? items.filter((i) => i.gameType === filter) : items;

  return (
    <div>
      <div className="admin-section-header">
        <h2>미션 / 단어 제안 목록</h2>
        <select
          className="admin-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as SuggestionGameType | "")}
        >
          <option value="">전체</option>
          {(Object.keys(SUGGESTION_GAME_TYPE_LABELS) as SuggestionGameType[]).map((type) => (
            <option key={type} value={type}>{SUGGESTION_GAME_TYPE_LABELS[type]}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <p className="admin-empty">제안이 없습니다.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>게임</th>
              <th>내용</th>
              <th>작성자</th>
              <th>날짜</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{SUGGESTION_GAME_TYPE_LABELS[item.gameType]}</td>
                <td className="admin-content-cell">{item.content}</td>
                <td>{item.authorName}</td>
                <td>{new Date(item.createdAt).toLocaleDateString("ko-KR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
