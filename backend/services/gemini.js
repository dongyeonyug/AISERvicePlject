const OpenAI = require('openai');

const PROVIDERS = [
  
  {
    name: 'Groq',
    envKey: 'GROQ_API_KEY',
    baseURL: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
  },
  {
    name: 'Gemini',
    envKey: 'GEMINI_API_KEY',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    model: 'gemini-2.5-flash',
  },
];

async function callWithFallback(messages) {
  for (const { name, envKey, baseURL, model } of PROVIDERS) {
    const apiKey = process.env[envKey];
    if (!apiKey || apiKey.startsWith('your_')) {
      console.log(`[AI] ${name} 키 미설정, 건너뜀`);
      continue;
    }
    try {
      const client = new OpenAI({ apiKey, baseURL, timeout: 8000 });
      const completion = await client.chat.completions.create({
        model,
        messages,
        temperature: 0.5,
        max_tokens: 150,
      });
      console.log(`[AI] ${name} 응답 성공`);
      return completion.choices[0].message.content.trim();
    } catch (e) {
      console.error(`[AI] ${name} 실패 → 다음 공급사 시도:`, e.message?.split('\n')[0]);
    }
  }
  return null;
}

const ENDINGS = ['해요.', '좋아요.', '하고 싶어요.'];

function buildLocalSentence(words) {
  if (!words || words.length === 0) return '단어를 선택해 주세요.';
  if (words.length === 1) return `${words[0]} 좋아요.`;
  const ending = ENDINGS[words.length % ENDINGS.length];
  return `${words.join(' ')} ${ending}`;
}

async function composeSentence(words) {
  const messages = [
    {
      role: 'system',
      content: '당신은 한국어 문장 작가입니다. 주어진 단어를 반드시 모두 포함한 간결하고 담백한 문장 하나를 만듭니다.',
    },
    {
      role: 'user',
      content: `단어 리스트: ${words.join(', ')}`,
    },
  ];
  const result = await callWithFallback(messages);
  if (result) return result;
  console.log('[AI] 모든 공급사 실패 → 로컬 폴백 사용');
  return buildLocalSentence(words);
}

async function composeEmotion(emotion) {
  const messages = [
    {
      role: 'system',
      content: '당신은 한국어 문장 작가입니다. 부연 설명 없이 문장만 출력하세요.',
    },
    {
      role: 'user',
      content: `감정 상태가 '${emotion}'인 사람이 할 법한 자연스러운 한국어 문장 1개만 만들어줘.`,
    },
  ];
  const result = await callWithFallback(messages);
  return result ?? '지금 그런 기분이에요.';
}

module.exports = { composeSentence, composeEmotion };
