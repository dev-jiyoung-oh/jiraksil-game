# 지락실 게임 🎮

> tvN 예능 *지구오락실* 콘셉트의 파티형 웹 게임 모음 서비스  
> 여럿이 모였을 때 빠르게 즐길 수 있는 캐주얼 게임을 목표로 개발  
> 프론트엔드 레포지토리 (화면 및 UI 로직 구현)  


## 📅 개발 기간

- 2025.06 – 현재 (진행 중)



## 🛠 기술 스택

- React 19
- TypeScript
- React Router
- Axios
- Vite
- ESLint
- dayjs
- normalize.css



## 📐 프로젝트 기획 의도 및 UI 설계 방향

- 여럿이 모였을 때 **빠르게 시작하고 쉽게 이해할 수 있는 파티 게임**을 목표로 기획
- 복잡한 설정 없이 **게임 생성 → 참여 → 플레이** 흐름에 집중
- 게임별 특성을 고려해 **라우트 단위로 화면과 로직을 분리**
- 공통 UI(Header, 모달, 버튼 등)는 재사용 가능한 컴포넌트로 구성
- 접근성과 가독성을 고려한 **시맨틱 구조와 스타일 분리(a11y, layout, typography)** 적용


## 🎮 제공 게임 및 주요 기능

### 1️⃣ 자네 지금 뭐 하는 건가 (WakeUpMission)
> 기상 미션 수행 게임
- 게임 생성 및 참여 코드 기반 입장
- 인원 수 입력하여 게임 생성
- 인원 수에 맞춰 미션 카드 자동 생성
- 카드 뒤집기 방식으로 미션 확인
- 단순 규칙 기반의 빠른 사용 목적 캐주얼 게임

### 2️⃣ 몸으로 말해요 (Charades)
>  제시어를 몸으로 표현하는 게임
- 게임 생성 및 참여 코드 기반 입장
- 라운드 / 턴 단위 게임 진행
- 제시어 카드 확인
- 타이머 기반 진행
- 점수 집계 및 최종 결과 화면 제공
- 관리자(Manage) / 플레이(Play) 화면 분리



## 🔄 API 연계 구조

- 화면단에서는 Axios를 통해 API 서버와 통신
- 게임 생성, 참여, 진행에 필요한 데이터는 서버에서 관리
- 실제 서버 구현은 별도 레포지토리에서 관리

👉 **Backend Repository**  
🔗 https://github.com/dev-jiyoung-oh/jiraksil-game-backend



## 📁 프로젝트 구조

**게임 단위로 화면과 컴포넌트를 분리**한 구조로 구성

```txt
jiraksil-game/
│
├── src/
│   ├── api/                     # API 호출 모듈
│   │   ├── api.ts
│   │   ├── charades.ts
│   │   └── wakeUpMission.ts
│   │
│   ├── components/              # 재사용 UI 컴포넌트
│   │   ├── charades/             # Charades 전용 컴포넌트
│   │   ├── wake-up-mission/      # WakeUpMission 전용 컴포넌트
│   │   └── common/               # 공통 UI (Header, Modal 등)
│   │
│   ├── pages/                   # 라우트 단위 페이지
│   │   ├── Home.tsx
│   │   └── games/
│   │       ├── charades/
│   │       └── wake-up-mission/
│   │
│   ├── styles/                  # 전역 스타일
│   │   ├── reset.css
│   │   ├── layout.css
│   │   ├── typography.css
│   │   ├── buttons.css
│   │   └── a11y.css
│   │
│   ├── utils/                   # 공통 유틸 로직
│   ├── types/                   # 타입 정의
│   ├── App.tsx                  # 루트 컴포넌트
│   └── main.tsx                 # 엔트리 포인트
│
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 🌱 향후 개선 및 확장 계획

- 게임 공통 상태 관리 구조 정리
- UI/UX 개선 (애니메이션, 피드백 요소 강화)
- 모바일 환경 대응
- 신규 파티 게임(인물퀴즈 등) 추가

## ✍️ 기타

- 본 프로젝트는 개인 프로젝트로, 기획부터 프론트엔드 구조 설계 및 구현까지 전 과정을 직접 진행
