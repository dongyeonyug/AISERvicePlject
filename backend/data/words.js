module.exports = [
  // 장소
  { id: 1,  label: "학교",    emoji: "🏫", category: "장소", color: "#E6F1FB", textColor: "#185FA5", recommendedHours: [6,7,8,9,10,11] },
  { id: 2,  label: "집",      emoji: "🏠", category: "장소", color: "#E6F1FB", textColor: "#185FA5", recommendedHours: [14,15,16,17,18,19,20] },
  { id: 3,  label: "화장실",  emoji: "🚽", category: "장소", color: "#E6F1FB", textColor: "#185FA5", recommendedHours: [7,8,12,13,18,19] },
  { id: 4,  label: "교실",    emoji: "🏫", category: "장소", color: "#E6F1FB", textColor: "#185FA5", recommendedHours: [9,10,11,12] },
  { id: 5,  label: "도서관",  emoji: "📚", category: "장소", color: "#E6F1FB", textColor: "#185FA5", recommendedHours: [10,11,13,14] },
  { id: 6,  label: "병원",    emoji: "🏥", category: "장소", color: "#E6F1FB", textColor: "#185FA5", recommendedHours: [] },
  { id: 7,  label: "마트",    emoji: "🛒", category: "장소", color: "#E6F1FB", textColor: "#185FA5", recommendedHours: [10,11,14,15] },

  // 행동
  { id: 8,  label: "가다",      emoji: "🚶", category: "행동", color: "#E1F5EE", textColor: "#0F6E56", recommendedHours: [6,7,8,9] },
  { id: 9,  label: "먹다",      emoji: "🍽️", category: "행동", color: "#E1F5EE", textColor: "#0F6E56", recommendedHours: [7,8,12,13,18,19] },
  { id: 10, label: "자다",      emoji: "😴", category: "행동", color: "#E1F5EE", textColor: "#0F6E56", recommendedHours: [0,1,2,3,4,5,21,22,23] },
  { id: 11, label: "놀다",      emoji: "🎮", category: "행동", color: "#E1F5EE", textColor: "#0F6E56", recommendedHours: [14,15,16,17] },
  { id: 12, label: "공부하다",  emoji: "📖", category: "행동", color: "#E1F5EE", textColor: "#0F6E56", recommendedHours: [9,10,11,14,15] },
  { id: 13, label: "쉬다",      emoji: "😌", category: "행동", color: "#E1F5EE", textColor: "#0F6E56", recommendedHours: [14,15,18,19,20] },
  { id: 14, label: "일어나다",  emoji: "☀️", category: "행동", color: "#E1F5EE", textColor: "#0F6E56", recommendedHours: [6,7,8] },
  { id: 15, label: "마시다",    emoji: "🥤", category: "행동", color: "#E1F5EE", textColor: "#0F6E56", recommendedHours: [7,12,15,18] },
  { id: 16, label: "보다",      emoji: "👀", category: "행동", color: "#E1F5EE", textColor: "#0F6E56", recommendedHours: [19,20,21] },
  { id: 17, label: "양치",      emoji: "🪥", category: "행동", color: "#E1F5EE", textColor: "#0F6E56", recommendedHours: [0,1,7,8,21,22] },
  { id: 18, label: "가방",      emoji: "🎒", category: "행동", color: "#E1F5EE", textColor: "#0F6E56", recommendedHours: [6,7,8] },
  { id: 19, label: "이불",      emoji: "🛏️", category: "행동", color: "#E1F5EE", textColor: "#0F6E56", recommendedHours: [0,1,2,3,4,5,21,22,23] },

  // 음식
  { id: 20, label: "밥",    emoji: "🍚", category: "음식", color: "#FAEEDA", textColor: "#854F0B", recommendedHours: [7,8,12,13,18,19] },
  { id: 21, label: "간식",  emoji: "🍪", category: "음식", color: "#FAEEDA", textColor: "#854F0B", recommendedHours: [14,15,16] },
  { id: 22, label: "물",    emoji: "💧", category: "음식", color: "#FAEEDA", textColor: "#854F0B", recommendedHours: [7,12,15,18] },
  { id: 23, label: "사과",  emoji: "🍎", category: "음식", color: "#FAEEDA", textColor: "#854F0B", recommendedHours: [14,15] },
  { id: 24, label: "빵",    emoji: "🍞", category: "음식", color: "#FAEEDA", textColor: "#854F0B", recommendedHours: [7,8] },
  { id: 25, label: "우유",  emoji: "🥛", category: "음식", color: "#FAEEDA", textColor: "#854F0B", recommendedHours: [7,8] },
  { id: 26, label: "과자",  emoji: "🍿", category: "음식", color: "#FAEEDA", textColor: "#854F0B", recommendedHours: [14,15,16,20] },
  { id: 27, label: "저녁",  emoji: "🍜", category: "음식", color: "#FAEEDA", textColor: "#854F0B", recommendedHours: [18,19,20] },

  // 감정
  { id: 28, label: "즐겁다",   emoji: "😊", category: "감정", color: "#EDE9FF", textColor: "#4C38B6", recommendedHours: [9,10,11,14,15] },
  { id: 29, label: "슬프다",   emoji: "😢", category: "감정", color: "#EDE9FF", textColor: "#4C38B6", recommendedHours: [] },
  { id: 30, label: "화나다",   emoji: "😠", category: "감정", color: "#EDE9FF", textColor: "#4C38B6", recommendedHours: [] },
  { id: 31, label: "피곤하다", emoji: "😴", category: "감정", color: "#EDE9FF", textColor: "#4C38B6", recommendedHours: [0,1,2,3,14,15,16,17,21] },
  { id: 32, label: "좋다",     emoji: "👍", category: "감정", color: "#EDE9FF", textColor: "#4C38B6", recommendedHours: [9,10,11,14,15] },
  { id: 33, label: "배고프다", emoji: "😋", category: "감정", color: "#EDE9FF", textColor: "#4C38B6", recommendedHours: [7,11,12,17] },
  { id: 34, label: "졸리다",   emoji: "😪", category: "감정", color: "#EDE9FF", textColor: "#4C38B6", recommendedHours: [0,1,2,3,4,5,14,15,21,22] },
  { id: 35, label: "무섭다",   emoji: "😨", category: "감정", color: "#EDE9FF", textColor: "#4C38B6", recommendedHours: [] },

  // 사람
  { id: 36, label: "엄마",   emoji: "👩",    category: "사람", color: "#FBEAF0", textColor: "#993556", recommendedHours: [6,7,8,18,19,20] },
  { id: 37, label: "아빠",   emoji: "👨",    category: "사람", color: "#FBEAF0", textColor: "#993556", recommendedHours: [18,19,20] },
  { id: 38, label: "친구",   emoji: "👫",    category: "사람", color: "#FBEAF0", textColor: "#993556", recommendedHours: [9,10,11,14,15] },
  { id: 39, label: "선생님", emoji: "👩‍🏫", category: "사람", color: "#FBEAF0", textColor: "#993556", recommendedHours: [9,10,11,12] },
  { id: 40, label: "형",     emoji: "🧑",    category: "사람", color: "#FBEAF0", textColor: "#993556", recommendedHours: [18,19,20] },
  { id: 41, label: "동생",   emoji: "👶",    category: "사람", color: "#FBEAF0", textColor: "#993556", recommendedHours: [] },

  // 자연
  { id: 42, label: "꽃",   emoji: "🌸", category: "자연", color: "#EAF3DE", textColor: "#3B6D11", recommendedHours: [] },
  { id: 43, label: "나무", emoji: "🌳", category: "자연", color: "#EAF3DE", textColor: "#3B6D11", recommendedHours: [] },
  { id: 44, label: "해",   emoji: "☀️", category: "자연", color: "#EAF3DE", textColor: "#3B6D11", recommendedHours: [6,7,8] },
  { id: 45, label: "비",   emoji: "🌧️", category: "자연", color: "#EAF3DE", textColor: "#3B6D11", recommendedHours: [] },
  { id: 46, label: "구름", emoji: "☁️", category: "자연", color: "#EAF3DE", textColor: "#3B6D11", recommendedHours: [] },
  { id: 47, label: "바람", emoji: "💨", category: "자연", color: "#EAF3DE", textColor: "#3B6D11", recommendedHours: [] },
];
