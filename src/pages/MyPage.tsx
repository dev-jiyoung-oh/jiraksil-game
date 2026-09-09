import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/common/useAuth";
import { useToast } from "@/components/common/toast/useToast";
import CopyButton from "@/components/common/CopyButton";
import { updateProfile, changePassword, deleteAccount, getMyGames } from "@/api/user";
import { GAME_MODE_LABEL, GAME_STATUS_LABEL } from "@/utils/charades/labels";
import { formatDateTime } from "@/utils/date";
import { GAME_LABELS } from "@/types/common";
import type { MyGameSummary } from "@/types/user";
import "./MyPage.css";

function getManagePath(game: MyGameSummary): string {
  if (game.gameType === "CHARADES") {
    return `/game/charades/manage/${game.code}`;
  }
  return `/game/wake-up-mission/manage/${game.code}`;
}

export default function MyPage() {
  const { user, setUser, clearUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // 프로필
  const [name, setName] = useState(user?.name ?? "");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // 내 게임 목록
  const [myGames, setMyGames] = useState<MyGameSummary[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);

  // 비밀번호 변경
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 회원 탈퇴
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  // 미로그인 리다이렉트
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // 게임 목록 로드
  useEffect(() => {
    if (!user) return;
    getMyGames()
      .then((res) => setMyGames(res.games))
      .catch(() => showToast({ message: "게임 목록을 불러오지 못했습니다.", type: "error" }))
      .finally(() => setIsLoadingGames(false));
  }, [user, showToast]);

  // ESC 키 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowDeleteModal(false);
        setDeletePassword("");
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // 모달 오픈 시 포커스 이동
  useEffect(() => {
    if (showDeleteModal) {
      deleteModalRef.current?.focus();
    }
  }, [showDeleteModal]);

  if (!user) return null;

  // 모달 닫기
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletePassword("");
  };

  // 프로필 저장
  const handleSaveProfile = async () => {
    if (!name.trim()) {
      showToast({ message: "닉네임을 입력해주세요.", type: "warning" });
      return;
    }
    setIsSavingProfile(true);
    try {
      const updated = await updateProfile({ name: name.trim() });
      setUser(updated);
      setIsEditingProfile(false);
      showToast({ message: "프로필이 저장되었습니다.", type: "success" });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "저장에 실패했습니다.";
      showToast({ message: msg, type: "error" });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 프로필 수정 취소
  const handleCancelEdit = () => {
    setName(user.name ?? "");
    setIsEditingProfile(false);
  };

  // 비밀번호 변경
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast({ message: "모든 필드를 입력해주세요.", type: "warning" });
      return;
    }
    if (newPassword.length < 4 || newPassword.length > 24) {
      showToast({ message: "새 비밀번호는 4~24자여야 합니다.", type: "warning" });
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast({ message: "새 비밀번호가 일치하지 않습니다.", type: "warning" });
      return;
    }
    setIsChangingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast({ message: "비밀번호가 변경되었습니다.", type: "success" });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "비밀번호 변경에 실패했습니다.";
      showToast({ message: msg, type: "error" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // 회원 탈퇴
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      showToast({ message: "비밀번호를 입력해주세요.", type: "warning" });
      return;
    }
    setIsDeleting(true);
    try {
      await deleteAccount(deletePassword);
      clearUser();
      navigate("/");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "탈퇴 처리에 실패했습니다.";
      showToast({ message: msg, type: "error" });
      setIsDeleting(false);
    }
  };

  // 렌더링
  return (
    <div className="mypage-container">
      <h1 className="page-title">마이페이지</h1>

      {/* 섹션 1: 프로필 정보 */}
      <section className="mypage-section card">
        <h2 className="mypage-section-title">프로필 정보</h2>

        <div className="profile-row">
          <span className="profile-label">이메일</span>
          <span>{user.email}</span>
        </div>

        {isEditingProfile ? (
          <div className="profile-edit-form">
            <div className="form-group">
              <label htmlFor="profile-name">닉네임</label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary btn-small"
                onClick={handleCancelEdit}
                disabled={isSavingProfile}
              >
                취소
              </button>
              <button
                type="button"
                className="btn btn-primary btn-small"
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
              >
                {isSavingProfile ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-row">
            <span className="profile-label">닉네임</span>
            <span>{user.name || "(없음)"}</span>
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={() => setIsEditingProfile(true)}
            >
              수정
            </button>
          </div>
        )}
      </section>

      {/* 섹션 2: 내가 만든 게임 목록 */}
      <section className="mypage-section card">
        <h2 className="mypage-section-title">내가 만든 게임</h2>

        {isLoadingGames ? (
          <p className="font-gray">로딩 중...</p>
        ) : myGames.length === 0 ? (
          <p className="font-gray">아직 생성한 게임이 없습니다.</p>
        ) : (
          <table className="my-games-table">
            <thead>
              <tr>
                <th>게임 코드</th>
                <th>종류</th>
                <th>모드</th>
                <th>상태</th>
                <th>생성일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {myGames.map((game) => (
                <tr key={game.code}>
                  <td>
                    {game.code}
                    <CopyButton text={game.code} />
                  </td>
                  <td>{GAME_LABELS[game.gameType]}</td>
                  <td>{game.mode ? GAME_MODE_LABEL[game.mode] : "-"}</td>
                  <td>
                    {game.status ? (
                      <span className={`status-badge status-badge-${game.status}`}>
                        {GAME_STATUS_LABEL[game.status]}
                      </span>
                    ) : "-"}
                  </td>
                  <td>{formatDateTime(game.createdAt, "YY.MM.DD")}</td>
                  <td>
                    <Link to={getManagePath(game)} className="btn btn-secondary btn-small">
                      관리
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* 섹션 3: 비밀번호 변경 */}
      <section className="mypage-section card">
        <h2 className="mypage-section-title">비밀번호 변경</h2>
        <form className="form" onSubmit={handleChangePassword}>
          <div className="form-group">
            <label htmlFor="current-password">현재 비밀번호</label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password">새 비밀번호 (4~24자)</label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              minLength={4}
              maxLength={24}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">새 비밀번호 확인</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "변경 중..." : "비밀번호 변경"}
            </button>
          </div>
        </form>
      </section>

      {/* 섹션 4: 회원 탈퇴 */}
      <section className="mypage-section card danger-zone">
        <h2 className="mypage-section-title">회원 탈퇴</h2>
        <p className="font-gray font-sm">
          탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
        </p>
        <div className="form-actions mt-sm">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            탈퇴하기
          </button>
        </div>
      </section>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="mypage-modal-backdrop">
          <div
            ref={deleteModalRef}
            className="mypage-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            tabIndex={-1}
          >
            <h2 id="delete-modal-title">정말 탈퇴하시겠습니까?</h2>
            <p>탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.</p>
            <div className="form-group">
              <label htmlFor="delete-password">비밀번호 확인</label>
              <input
                id="delete-password"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                autoComplete="current-password"
                placeholder="현재 비밀번호를 입력하세요"
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeDeleteModal}
                disabled={isDeleting}
              >
                취소
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? "탈퇴 중..." : "탈퇴 확인"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
