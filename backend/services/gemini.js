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

async function composeSentence(words, style = 'simple') {
  const isDetailed = style === 'detailed';

  const systemPrompt = isDetailed
    ? '당신은 언어 장애가 있는 사용자의 의사소통을 돕는 AAC(보완대체의사소통) 인공지능입니다. 사용자가 선택한 단어들을 바탕으로, 상황이나 감정, 이유 등을 조금 더 살을 붙여 구체적이고 부드러운 한국어 문장(구어체, 해요체) 1개를 만들어주세요. 부연 설명 없이 오직 완성된 문장 하나만 출력해야 하며, 너무 길지 않은 자연스러운 대화체로 작성해주세요.'
    : '당신은 AAC(보완대체의사소통) 인공지능입니다. 사용자가 선택한 단어들을 반드시 모두 사용하여, 최소한의 길이로 극단적으로 짧고 간결한 한국어 문장(해요체) 1개만 만들어주세요. 절대 새로운 의미나 부가적인 단어를 덧붙이지 말고, 딱 필요한 조사와 어미만 사용하여 핵심만 전달해야 합니다. 부연 설명 없이 오직 완성된 문장 하나만 출력해야 합니다.';

  const userPrompt = isDetailed
    ? `선택한 단어들: ${words.join(', ')}\n이 단어들을 바탕으로 내 의사를 자세하고 부드럽게 표현하는 대화 문장을 만들어줘.`
    : `단어: ${words.join(', ')}\n조건: 다른 말은 덧붙이지 말고 최대한 짧게 요점만 말해.`;

  const messages = [
    {
      role: 'system',
      content: systemPrompt,
    },
    {
      role: 'user',
      content: userPrompt,
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
      content: '당신은 언어 장애가 있는 사용자의 의사소통을 돕는 AAC(보완대체의사소통) 인공지능입니다. 일상적인 대화에서 자연스럽게 감정을 표현하는 짧고 명확한 구어체 문장을 만들어주세요. 부연 설명 없이 문장만 출력하세요.',
    },
    {
      role: 'user',
      content: `지금 내 감정 상태는 '${emotion}'입니다. 이 감정을 주변 사람에게 표현하는 가장 자연스러운 한국어 문장 1개만 만들어줘.`,
    },
  ];
  const result = await callWithFallback(messages);
  return result ?? '지금 그런 기분이에요.';
}

module.exports = { composeSentence, composeEmotion };
