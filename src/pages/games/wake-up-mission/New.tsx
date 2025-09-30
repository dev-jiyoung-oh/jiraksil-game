import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { WakeUpMissionGame } from '@/types/wakeUpMission';
import { formatPhoneNumber } from '@/utils/phoneNumber';
import './New.css';

export default function WakeUpMissionNew() {
  const [numPlayers, setNumPlayers] = useState(1);
  const [wakeUpTime, setWakeUpTime] = useState('');
  const [contacts, setContacts] = useState<string[]>([]);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const clearError = () => {
    if (error) setError('');
  };

  const handleNumPlayersChange = (value: string) => {
    clearError();
    setNumPlayers(Number(value));
  };

  const handleWakeUpTimeChange = (value: string) => {
    clearError();
    setWakeUpTime(value);
  };
  
  const handlePasswordChange = (value: string) => {
    clearError();
    setPassword(value);
  };
  
  const handleContactChange = (index: number, value: string) => {
    clearError();
    setContacts((prev) =>
      prev.map((c, i) => (i === index ? formatPhoneNumber(value) : c))
    );
  };

  const addContactField = () => {
    clearError();
    setContacts((prev) => [...prev, '']);
  };

  const removeContact = (index: number) => {
    clearError();
    setContacts(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!password || password.length < 4) {
      setError('비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/wake-up-mission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numPlayers,
          wakeUpTime,
          contacts: contacts.filter((c) => c.trim()).join(','),
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('게임 생성에 실패했습니다.');
      }

      const data: WakeUpMissionGame = await response.json();

      // TODO id 수정 -> code
      navigate(`/game/wake-up-mission/${data.code}`, {
        state: data,
      });

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="new-container">
      <h1 className="new-title">자네 지금 뭐 하는 건가 - 게임 생성</h1>

      <div className="info-text" id="new-form-info">
        <p>ℹ️ 기상 시간과 연락처는 선택사항입니다.</p>
        <p>입력하시면 해당 시간에 카카오톡 메시지로 <strong>랜덤 기상 집합 장소</strong>가 전송됩니다.</p>
        <p>
          <strong>
            입력하신 시간 기준으로 해당 시간이 지나지 않았다면 오늘 알림이 전송됩니다.
            이미 지난 시간이면 내일 알림이 전송됩니다.
          </strong>
        </p>
      </div>

      <form className="new-form" onSubmit={handleSubmit} aria-labelledby="new-form-info">
        
        <div className="form-group">
          <label htmlFor="numPlayers" className="label-text">
            인원수
            <span aria-hidden="true" className="required">*</span>
            <span className="sr-only">필수항목</span>
          </label>
          <small id="numPlayers-desc" className="font-gray">인원수만큼 미션 카드가 생성됩니다.</small>
          <input
            type="number"
            name="numPlayers"
            id="numPlayers"
            aria-describedby="numPlayers-desc"
            min={1}
            max={30}
            value={numPlayers}
            onChange={(e) => handleNumPlayersChange(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="wakeUpTime" className="label-text">기상 시간</label>
          <small id="wakeUpTime-desc" className="font-gray">설정한 시간이 아직 지나지 않았다면 오늘, 지났다면 내일 카카오톡 알림이 발송됩니다.</small>
          <input
            type="time"
            name="wakeUpTime"
            id="wakeUpTime"
            aria-describedby="wakeUpTime-desc"
            value={wakeUpTime}
            onChange={(e) => handleWakeUpTimeChange(e.target.value)}
          />
        </div>


        <fieldset className="form-group">
          <legend className="label-text">연락처</legend>
          <small id="contacts-desc" className="font-gray">카카오톡으로 "랜덤 기상 집합 장소"를 전달받을 때 필요합니다.</small>

          {contacts.length > 0 && (
            <ul className="contacts-list">
              {contacts.map((contact, index) => (
                  <li key={index}>
                    <input
                      type="tel"
                      name="contact"
                      placeholder="010-0000-0000"
                      aria-describedby="contacts-desc"
                      value={contact}
                      onChange={(e) => handleContactChange(index, e.target.value)}
                    />
                    <button type="button" aria-label={`연락처 ${index + 1} 삭제`} className="btn btn-danger del-btn" onClick={() => removeContact(index)}>
                      삭제
                    </button>
                  </li>
                ))}
            </ul>
          )}

          <button
            type="button"
            aria-label="연락처 추가"
            className="btn add-contact"
            onClick={addContactField}
          >
            + 연락처 추가
          </button>
        </fieldset>

        <div className="form-group">
          <label htmlFor="password" className="label-text">
            비밀번호
            <span aria-hidden="true" className="required">*</span>
            <span className="sr-only">필수항목</span>
          </label>
          <small id="password-desc" className="font-gray">비밀번호는 관리화면에 접근할 때 필요합니다!</small>
          <input
            type="password"
            name="password"
            id="password"
            aria-describedby="password-desc"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            required
            minLength={4}
            placeholder="4자리 이상"
          />
        </div>

        {error && <p role="alert" className="font-danger">{error}</p>}

        <button type="submit"  className="btn btn-success" disabled={loading} aria-busy={loading}>
          {loading ? '게임 생성 중...' : '게임 생성하기'}
        </button>
      </form>
    </main>
  );
}
