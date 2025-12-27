import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateGame } from "@/api/charades";
import type {
  GameManageResponse,
  UpdateTeamDto,
  GameMode,
} from "@/types/charades";
import { useToast } from "@/components/common/toast/useToast";
import "./Update.css";

/**
 * 몸으로 말해요 - 게임 수정 페이지
 */
export default function CharadesUpdate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  // 관리화면에서 전달된 state 데이터
  const initialData = location.state as GameManageResponse | undefined;

  // 플레이 기록 여부
  const hasPlayHistory = initialData ? initialData.turns.length > 0 : false;

  // 게임 정보
  const [mode, setMode] = useState<GameMode>(initialData?.gameInfo.mode ?? "LIMITED");
  const [durationSec, setDurationSec] = useState(initialData?.gameInfo.durationSec ?? 90);
  const [targetCount, setTargetCount] = useState(initialData?.gameInfo.targetCount ?? 10);
  const [passLimit, setPassLimit] = useState(initialData?.gameInfo.passLimit ?? 2);
  const [roundsPerTeam, setRoundsPerTeam] = useState(initialData?.gameInfo.roundsPerTeam ?? 1);
  const [password, setPassword] = useState("");
  const [teams, setTeams] = useState<UpdateTeamDto[]>(initialData?.gameInfo.teams ?? []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.gameInfo.categories?.map((c) => c.code) ?? []
  );

  const allCategories = initialData?.categoryMaster ?? [];

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearError = () => error && setError("");

  // ====== 입력 핸들러 ======

  const handleModeChange = (value: GameMode) => {
    if (hasPlayHistory) return; // 기록 있으면 수정 불가
    clearError();
    setMode(value);
  };

  const toggleCategory = (code: string) => {
    clearError();
    setSelectedCategories((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  // 팀 추가
  const handleAddTeam = () => {
    clearError();
    if (teams.length >= 26) {
      setError("팀은 최대 26개까지 추가할 수 있습니다. (A~Z)");
      return;
    }
    setTeams([...teams, {
      code: null,
      name: "",
    }]);
  };

  // 팀 이름 변경
  const handleTeamNameChange = (index: number, value: string) => {
    if (hasPlayHistory) return;
    clearError();
    setTeams(prev =>
      prev.map((t, i) => (i === index ? { ...t, name: value } : t))
    );
  };

  // 팀 삭제
  const handleRemoveTeam = (index: number) => {
    clearError();
    setTeams(prev => prev.filter((_, i) => i !== index));
  };

  // TODO 팀 순서 변경


  // ====== 제출 ======
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!password || password.length < 4) {
      setError("비밀번호는 최소 4자리 이상이어야 합니다.");
      return;
    }

    if (!initialData) {
      setError("잘못된 접근입니다. 관리 화면에서 다시 시도해주세요.");
      return;
    }

    try {
      setLoading(true);

      const normalizedTeams: UpdateTeamDto[] = teams.map(t => ({
        code: t.code ?? null,
        name: t.name ?? "",
      }));


      const req = {
        mode,
        durationSec,
        targetCount,
        passLimit,
        roundsPerTeam,
        password,
        teams: normalizedTeams,
        categoryCodes: selectedCategories,
      };

      const updated = {...initialData};
      updated.gameInfo = await updateGame(initialData.gameInfo.code, req);

      showToast({
        message: "수정이 완료되었습니다.",
        type: "success",
      });
      
      navigate(`/game/charades/manage/${updated.gameInfo.code}`, {
        replace: true,
        state: updated,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };


  // ========== UI 렌더링 ==========

  return (
    <main className="update-container">
      <h1 className="update-title">몸으로 말해요 - 게임 수정</h1>

      {/* initialData 없을 때도 Hook 규칙 위반 없이 처리 */}
      {!initialData ? (
        <p className="font-danger">잘못된 접근입니다. 관리 화면에서 다시 시도해주세요.</p>
      ) : (
        <form className="update-form" onSubmit={handleSubmit}>
          {hasPlayHistory && (
            <p className="font-warning">
              이미 플레이 기록이 있어 일부 설정은 변경할 수 없습니다. (수정 가능한 설정: 카테고리)
            </p>
          )}

          {/* 모드 선택 */}
          <div className="form-group">
            <label htmlFor="mode">
              <span className="label-text">게임 모드</span>
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
              disabled={hasPlayHistory}
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
                onChange={(e) => setDurationSec(Number(e.target.value))}
                disabled={hasPlayHistory}
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
                onChange={(e) => setTargetCount(Number(e.target.value))}
                disabled={hasPlayHistory}
                required
              />
            </div>
          )}

          {/* 공통 옵션 */}
          <fieldset className="form-group" aria-describedby="categories-desc">
            <legend className="label-text">카테고리 선택</legend>
            <small id="categories-desc" className="font-gray">선택하지 않으면 전체 카테고리가 활성화됩니다.</small>

            <ul className="category-list">
              {allCategories.map((c) => (
                <li key={c.code}>
                  <label>
                    <input
                      type="checkbox"
                      name="category"
                      checked={selectedCategories.includes(c.code)}
                      onChange={() => toggleCategory(c.code)}
                    />
                    {c.name}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>

          <div className="form-group">
            <label className="label-text" htmlFor="roundsPerTeam">
              팀별 라운드 수
              <span aria-hidden="true" className="required">*</span>
              <span className="sr-only">필수항목</span>
            </label>
            <small id="roundsPerTeam-desc" className="font-gray">각 팀당 1 ~ 10 라운드까지 플레이 가능합니다.</small>
            <input
              type="number"
              id="roundsPerTeam"
              name="roundsPerTeam"
              aria-describedby="roundsPerTeam-desc"
              value={roundsPerTeam}
              min={1}
              max={10}
              onChange={(e) => setRoundsPerTeam(Number(e.target.value))}
              disabled={hasPlayHistory}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="passLimit" className="label-text">
              라운드별 패스 제한
              <span aria-hidden="true" className="required">*</span>
              <span className="sr-only">필수항목</span>
            </label>
            <small id="passLimit-desc" className="font-gray">각 라운드당 0 ~ 10 개까지 사용 가능합니다.</small>
            <input
              type="number"
              id="passLimit"
              name="passLimit"
              aria-describedby="passLimit-desc"
              value={passLimit}
              min={0}
              max={10}
              onChange={(e) => setPassLimit(Number(e.target.value))}
              required
              disabled={hasPlayHistory}
            />
          </div>

          <fieldset className="form-group" aria-describedby="teamNames-desc1 teamNames-desc2">
            <legend>
              <span className="label-text">팀 이름</span>
              <span aria-hidden="true" className="required">*</span>
              <span className="sr-only">필수항목</span>
            </legend>
            <small id="teamNames-desc1" className="font-gray">최소 1팀, 최대 26팀까지 추가할 수 있습니다.</small>
            <small id="teamNames-desc2" className="font-gray">팀 이름 미입력시 다음과 같이 저장됩니다: Team A, Team B, ...</small>

            <ul className="team-list">
              {teams.map((t, idx) => (
                <li key={idx}>
                  <input
                    type="text"
                    name="teamName"
                    value={t.name}
                    placeholder={`Team ${String.fromCharCode(65 + idx)}`}
                    onChange={(e) => handleTeamNameChange(idx, e.target.value)}
                    disabled={hasPlayHistory}
                  />
                  {!hasPlayHistory && teams.length > 1 && (
                    <button
                      type="button"
                      aria-label={`Team ${String.fromCharCode(65 + idx)} 삭제`}
                      className="btn btn-danger del-btn"
                      onClick={() => handleRemoveTeam(idx)}
                    >
                      삭제
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {!hasPlayHistory && teams.length < 26 && (
              <button
                type="button"
                aria-label="팀 추가"
                className="btn add-contact"
                onClick={handleAddTeam}
              >
                + 팀 추가
              </button>
            )}
          </fieldset>

          <div className="form-group">
            <label htmlFor="password" className="label-text">
              비밀번호
              <span aria-hidden="true" className="required">*</span>
              <span className="sr-only">필수항목</span>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              minLength={4}
              required
              value={password}
              placeholder="4자리 이상"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p role="alert" className="font-danger">{error}</p>}

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "수정 중..." : "게임 수정하기"}
          </button>
        </form>
      )}
    </main>
  );
}
