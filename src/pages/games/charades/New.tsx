import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import type { GameMode, CreateGameResponse } from "@/types/charades";

export default function CharadesNew() {
  const navigate = useNavigate();

  // ====== 상태 정의 ======
  const [categories, setCategories] = useState<{ code: string; name: string }[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [mode, setMode] = useState<GameMode>("LIMITED");
  const [durationSec, setDurationSec] = useState(90);
  const [targetCount, setTargetCount] = useState(10);
  const [passLimit, setPassLimit] = useState(2);
  const [roundsPerTeam, setRoundsPerTeam] = useState(3);
  const [teamNames, setTeamNames] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // ====== 초기 데이터 로딩 ======
  // 카테고리 조회
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<{ code: string; name: string }[]>("/charades/categories");
        setCategories(data);
      } catch (err) {
        setError("카테고리 목록을 불러오지 못했습니다.");
        console.error("카테고리 목록을 불러오지 못했습니다.", err);
      }
    })();
  }, []);
    
  // ====== 헬퍼 ======
  const clearError = () => error && setError("");

  // ====== 입력 핸들러 ======
  const handleModeChange = (value: GameMode) => {
    clearError();
    setMode(value);
  };

  const handleDurationSecChange = (value: number) => {
    clearError();
    setDurationSec(value);
  };

  const handleTargetCountChange = (value: number) => {
    clearError();
    setTargetCount(value);
  };

  const handlePassLimitChange = (value: number) => {
    clearError();
    setPassLimit(value);
  };

  const handleRoundsPerTeamChange = (value: number) => {
    clearError();
    setRoundsPerTeam(value);
  };

  // ====== 리스트 조작 핸들러 ======
  // 카테고리 선택
  const toggleCategory = (code: string) => {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  // 팀 추가
  const handleAddTeam = () => {
    clearError();
    if (teamNames.length >= 26) {
      setError("팀은 최대 26개까지 추가할 수 있습니다. (A~Z)");
      return;
    }
    setTeamNames([...teamNames, ""]);
  };

  // 팀 삭제
  const handleRemoveTeam = (index: number) => {
    clearError();
    setTeamNames(teamNames.filter((_, i) => i !== index));
  };

  // 팀 이름 변경
  const handleTeamNameChange = (index: number, value: string) => {
    clearError();
    setTeamNames(teamNames.map((t, i) => (i === index ? value : t)));
  };

  // ====== 제출 처리 ======
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      setLoading(true);

      const { data } = await api.post<CreateGameResponse>("/charades", {
        options: {
          mode,
          durationSec,
          targetCount,
          passLimit,
          roundsPerTeam,
          categoryCodes: selectedCodes,
        },
        teamNames: teamNames.map((n, i) => n.trim() || `Team ${String.fromCharCode(65 + i)}`),
      });

      // 성공 시 게임 진행 페이지로 이동
      navigate(`/game/charades/${data.code}`, {
        state: data
      });

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "게임 생성에 실패했습니다.");
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ====== 렌더링 ======
  return (
    <main className="new-container">
      <h1 className="new-title">몸으로 말해요 - 게임 생성</h1>

      <form className="new-form" onSubmit={handleSubmit}>
        {/* 모드 선택 */}
        <div className="form-group">
          <label htmlFor="mode" className="label-text">
            게임 모드
            <span aria-hidden="true" className="required">*</span>
            <span className="sr-only">필수항목</span>
          </label>
          <small id="mode-limited-desc" className="font-gray">- 제한 시간 모드: 제한 시간 내에 맞추는 개수를 카운팅</small>
          <small id="mode-until-clear-desc" className="font-gray">- 목표 정답 모드: 목표 정답 수를 맞출 때까지 걸린 시간을 카운팅</small>

          <select
            id="mode"
            name="mode"
            value={mode}
            onChange={(e) => handleModeChange(e.target.value as GameMode)}
            required
          >
            <option value="LIMITED" aria-labelledby="mode-limited-desc">제한 시간 모드</option>
            <option value="UNTIL_CLEAR" aria-labelledby="mode-until-clear-desc">목표 정답 모드</option>
          </select>
        </div>

        {/* 모드별 옵션 */}
        {mode === "LIMITED" && (
          <div className="form-group">
            <label htmlFor="durationSec" className="label-text">
              제한 시간(초)
              <span aria-hidden="true" className="required">*</span>
              <span className="sr-only">필수항목</span>
            </label>
            <input
              type="number"
              id="durationSec"
              name="durationSec"
              value={durationSec}
              min={10}
              max={600}
              step={10}
              onChange={(e) => handleDurationSecChange(Number(e.target.value))}
              required
            />
          </div>
        )}

        {mode === "UNTIL_CLEAR" && (
          <div className="form-group">
            <label htmlFor="targetCount" className="label-text">
              목표 정답 수
              <span aria-hidden="true" className="required">*</span>
              <span className="sr-only">필수항목</span>
            </label>
            <small id="targetCount-desc" className="font-gray">최소 1문제, 최대 20문제</small>
            <input
              type="number"
              id="targetCount"
              name="targetCount"
              aria-labelledby="targetCount-desc"
              value={targetCount}
              min={1}
              max={20}
              onChange={(e) => handleTargetCountChange(Number(e.target.value))}
              required
            />
          </div>
        )}

        {/* 공통 옵션 */}
        <fieldset className="form-group" aria-describedby="categories-desc">
          <legend className="label-text">카테고리 선택</legend>
          <small id="categories-desc" className="font-gray">선택하지 않으면 전체 카테고리가 활성화됩니다.</small>

          <ul className="category-list">
            {categories.map((c) => (
              <li key={c.code}>
                <label>
                  <input
                    type="checkbox"
                    name="category"
                    checked={selectedCodes.includes(c.code)}
                    onChange={() => toggleCategory(c.code)}
                  />
                  {c.name}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <div className="form-group">
          <label htmlFor="passLimit" className="label-text">
            패스 제한
            <span aria-hidden="true" className="required">*</span>
            <span className="sr-only">필수항목</span>
          </label>
          <small id="passLimit-desc" className="font-gray">0 ~ 10 개까지 가능합니다.</small>
          <input
            type="number"
            id="passLimit"
            name="passLimit"
            aria-describedby="passLimit-desc"
            value={passLimit}
            min={0}
            max={10}
            onChange={(e) => handlePassLimitChange(Number(e.target.value))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="roundsPerTeam" className="label-text">
            팀별 라운드 수
            <span aria-hidden="true" className="required">*</span>
            <span className="sr-only">필수항목</span>
          </label>
          <small id="roundsPerTeam-desc" className="font-gray">1 ~ 10 라운드까지 가능합니다.</small>
          <input
            type="number"
            id="roundsPerTeam"
            name="roundsPerTeam"
            aria-describedby="roundsPerTeam-desc"
            value={roundsPerTeam}
            min={1}
            max={10}
            onChange={(e) => handleRoundsPerTeamChange(Number(e.target.value))}
            required
          />
        </div>

        {/* 팀명 입력 */}
        <fieldset className="form-group" aria-describedby="teamNames-desc1 teamNames-desc2">
          <legend className="label-text">
            팀 이름
            <span aria-hidden="true" className="required">*</span>
            <span className="sr-only">필수항목</span>
          </legend>
          <small id="teamNames-desc1" className="font-gray">최소 1팀, 최대 26팀까지 추가할 수 있습니다.</small>
          <small id="teamNames-desc2" className="font-gray">팀 이름 미입력시 다음과 같이 저장됩니다: Team A, Team B, ...</small>

          <ul className="team-list">
            {teamNames.map((name, index) => (
              <li key={index}>
                <input
                  type="text"
                  placeholder={`Team ${String.fromCharCode(65 + index)}`}
                  name="teamName"
                  value={name}
                  onChange={(e) => handleTeamNameChange(index, e.target.value)}
                />
                {teamNames.length > 1 && (
                  <button
                    type="button"
                    aria-label={`Team ${String.fromCharCode(65 + index)} 삭제`}
                    className="btn btn-danger del-btn"
                    onClick={() => handleRemoveTeam(index)}
                  >
                    삭제
                  </button>
                )}
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-label="팀 추가"
            className="btn add-contact"
            onClick={handleAddTeam}
          >
            + 팀 추가
          </button>
        </fieldset>

        {/* 에러 메시지 */}
        {error && <p role="alert" className="font-danger">{error}</p>}

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="btn btn-success"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "게임 생성 중..." : "게임 생성하기"}
        </button>
      </form>
    </main>
  );
}
