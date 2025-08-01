import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { GameData } from '@/types/wakeUpMission';
import './New.css'

export default function WakeUpMissionNew() {
  const [numPlayers, setNumPlayers] = useState(1)
  const [wakeUpTime, setWakeUpTime] = useState('')
  const [contacts, setContacts] = useState<string[]>([''])
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleContactChange = (index: number, value: string) => {
    setContacts((prev) =>
      prev.map((c, i) => (i === index ? value : c))
    )
  }

  const addContactField = () => {
    setContacts((prev) => [...prev, ''])
  }

  const removeContact = (index: number) => {
    setContacts(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!password || password.length < 4) {
      setError('비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }

    setLoading(true)
    try {
      // POST 요청
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/wake-up-mission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numPlayers,
          wakeUpTime,
          contacts: contacts.filter((c) => c.trim() !== '').join(','),
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('게임 생성에 실패했습니다.')
      }

      const data: GameData = await response.json();

      navigate(`/game/wake-up-mission/${data.id}`, {
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
  }

  return (
    <div className="new-container">
      <h2 className="new-title">Wake Up Mission - 게임 생성</h2>

      <form className="new-form" onSubmit={handleSubmit}>
        <p className="info-text">
          ℹ️ 기상 시간과 연락처는 선택사항입니다.<br />
          입력하시면 해당 시간에 카카오톡 메시지로 <strong>랜덤 기상 집합 장소</strong>가 전송됩니다.<br />
          <strong>입력하신 시간 기준으로 해당 시간이 지나지 않았다면 오늘 알림이 전송됩니다. 이미 지난 시간이면 내일 알림이 전송됩니다.
</strong>
        </p>

        <label>
          <span className="label-text">
            인원수 <span className="required">*</span>
          </span>
          <input
            type="number"
            name="numPlayers"
            min={1}
            max={30}
            value={numPlayers}
            onChange={(e) => setNumPlayers(Number(e.target.value))}
            required
          />
        </label>

        <label>
          <span className="label-text">기상 시간</span>
          <input
            type="time"
            name="wakeUpTime"
            value={wakeUpTime}
            onChange={(e) => setWakeUpTime(e.target.value)}
          />
        </label>

        <label>
          <span className="label-text">연락처</span>

          {contacts.length > 0 && (
            <ul className="contacts-list">

              {contacts.map((contact, index) => (
                <li key={index}>
                  <input
                    type="text"
                    name="contact"
                    placeholder="010-0000-0000"
                    value={contact}
                    onChange={(e) => handleContactChange(index, e.target.value)}
                  />
                  <button type="button" onClick={() => removeContact(index)}>
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            className="add-contact"
            onClick={addContactField}
          >
            + 연락처 추가
          </button>
        </label>

        <label>
          <span className="label-text">
            비밀번호
            <span className="required">*</span>
            <span>비밀번호는 관리화면에 접근할 때 필요합니다!</span>
          </span>
          
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
            placeholder="4자리 이상"
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? '게임 생성 중...' : '게임 생성하기'}
        </button>
      </form>
    </div>
  )
}
