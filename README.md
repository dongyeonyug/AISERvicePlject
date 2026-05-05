# AI 기반 지능형 맞춤형 AAC 플랫폼

언어 장애 아동이 감정·의사를 더 쉽게 표현할 수 있도록 돕는 **보완대체의사소통(AAC) 앱** 프로토타입입니다.  
Google Gemini API를 활용해 선택한 단어·감정을 자연스러운 한국어 문장으로 자동 완성합니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 상황 인지 단어 추천 | 현재 시간대에 맞는 단어를 우선 노출 |
| AI 문장 자동 완성 | 단어 카드 선택 → Gemini가 자연스러운 문장 생성 |
| 감정 표현 | 10가지 감정 카드 선택 → 감정 기반 문장 제안 |
| 카테고리 필터 | 감정·장소·행동·음식·사람·자연 6개 카테고리 |
| 문장 저장 | 생성된 문장을 최근 목록에 저장 |
| 개인화 설정 | 카드 크기·글자 크기·음성 속도·AI 추천 On/Off |
| 보호자 관리 | 보호자 등록 및 알림 설정 |

---

## 기술 스택

### 백엔드
- **Node.js** + **Express** — REST API 서버
- **Google Gemini API** (`gemini-1.5-flash`) — AI 문장 생성
- **dotenv** — 환경변수 관리

### 프론트엔드
- **React Native** + **Expo** — 크로스플랫폼 모바일 앱
- **React Navigation** (Bottom Tabs) — 화면 네비게이션
- **axios** — HTTP 클라이언트

---

## 폴더 구조

```
aiProtect/
├── backend/
│   ├── data/
│   │   ├── words.js          # 47개 단어 mock 데이터 (6개 카테고리)
│   │   ├── emotions.js       # 10개 감정 mock 데이터
│   │   └── sentences.js      # 최근 문장 10개 mock 데이터
│   ├── routes/
│   │   ├── words.js          # GET /api/words, /api/emotions
│   │   ├── sentences.js      # POST /api/sentence/compose, GET /api/sentences/recent
│   │   └── profile.js        # GET /api/profile, PATCH /api/profile/settings
│   ├── services/
│   │   └── gemini.js         # Gemini API 연동 (composeSentence, composeEmotion)
│   ├── server.js
│   ├── .env                  # 실제 API 키 (gitignore됨)
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── client.js     # axios 인스턴스 + 7개 API 함수
    │   ├── components/
    │   │   ├── WordCard.js   # 단어 카드 (추천 뱃지, 선택 상태)
    │   │   ├── EmotionCard.js # 감정 카드 (3열 그리드)
    │   │   ├── AIBox.js      # AI 문장 결과 박스
    │   │   └── SentenceBar.js # 선택 단어 바 + 말하기 버튼
    │   ├── screens/
    │   │   ├── HomeScreen.js      # 홈 (추천·카테고리·단어 그리드)
    │   │   ├── SentenceScreen.js  # 문장 만들기
    │   │   ├── EmotionScreen.js   # 감정 표현
    │   │   └── SettingsScreen.js  # 설정 및 개인화
    │   └── constants/
    │       └── colors.js     # 공통 색상 상수
    ├── App.js                # 하단 탭 네비게이터
    └── package.json
```

---

## 시작하기

### 필수 조건
- Node.js 18 이상
- Expo CLI (`npm install -g expo-cli`)
- Expo Go 앱 (iOS / Android)
- Gemini API 키 — [Google AI Studio](https://aistudio.google.com) 에서 무료 발급

---

### 백엔드 실행

```bash
cd aiProtect/backend
npm install
cp .env.example .env
```

`.env` 파일을 열어 API 키를 입력합니다.

```
GEMINI_API_KEY=발급받은_키_입력
PORT=3000
```

```bash
node server.js
# → AAC 백엔드 서버가 포트 3000에서 실행 중입니다.
```

---

### 프론트엔드 실행

```bash
cd aiProtect/frontend
npm install
npx expo start
```

터미널에 QR코드가 표시되면 **Expo Go** 앱으로 스캔합니다.

> **실기기 사용 시:** `src/api/client.js`의 `baseURL`을 `localhost` 대신 개발 PC의 로컬 IP(예: `http://192.168.0.10:3000`)로 변경하세요.

---

## API 명세

| 메서드 | 엔드포인트 | 설명 | 파라미터 |
|--------|-----------|------|---------|
| GET | `/api/words` | 단어 목록 조회 | `?category=장소&hour=9` |
| GET | `/api/emotions` | 감정 목록 조회 | — |
| POST | `/api/sentence/compose` | AI 문장 생성 | `{ words: ["학교","가다"] }` |
| POST | `/api/sentence/compose-emotion` | 감정 기반 AI 문장 | `{ emotion: "즐거워요" }` |
| GET | `/api/sentences/recent` | 최근 문장 목록 | — |
| GET | `/api/profile` | 프로필 조회 | — |
| PATCH | `/api/profile/settings` | 설정 업데이트 | `{ cardSize: "크게" }` |

### 응답 예시

```json
// GET /api/words?hour=9
{
  "recommended": [
    { "id": 1, "label": "학교", "emoji": "🏫", "category": "장소", "color": "#E6F1FB", "textColor": "#185FA5" }
  ],
  "words": [ ... ]
}

// POST /api/sentence/compose
{ "sentence": "학교에 가서 정말 즐거워요!" }
```

---

## 환경변수 설명

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `GEMINI_API_KEY` | Google Gemini API 인증 키 | (필수) |
| `PORT` | 백엔드 서버 포트 | `3000` |

---

## 주의사항

- **Gemini 무료 티어**: 분당 15회 요청 제한 — 단어 선택마다 API가 호출되므로 빠르게 탭하면 제한에 걸릴 수 있습니다.
- **mock 데이터 기반 프로토타입**: DB가 없으며, 프로필·최근 문장 등은 서버 재시작 시 초기화됩니다.
- **음성 출력**: 현재 `Alert`으로 대체됩니다. 실제 TTS는 `expo-speech` 패키지로 구현 가능합니다.
- **실기기 연결**: iOS 시뮬레이터는 `localhost`로 접근 가능하지만, 실물 기기는 반드시 PC와 동일 네트워크에서 로컬 IP를 사용해야 합니다.

---

## 최종 완료 확인 체크리스트

- [x] `node server.js` → 포트 3000 정상 실행
- [x] `npx expo start` → Expo Go에서 앱 실행
- [x] 홈: 단어 선택 → AI 문장 자동 생성
- [x] 홈: 카테고리 탭 필터 동작
- [x] 감정: 감정 선택 → AI 문장 제안
- [x] 설정: 토글/버튼 상태 변경 → 즉시 반영
- [x] 문장 만들기: 저장 → 최근 문장 목록에 추가
- [x] README.md 작성 완료
