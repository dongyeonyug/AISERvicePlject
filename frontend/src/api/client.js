import axios from 'axios';
import Constants from 'expo-constants';

const getBaseURL = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:3000`;       // 개발 시 로컬
  }
  return 'https://aiserviceplject.onrender.com'; // 배포 후 Render URL로 교체
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

export const getWords = (category, hour) =>
  api.get('/api/words', { params: { category, hour } }).then(r => r.data);

export const getFrequentWords = (limit = 5) =>
  api.get('/api/words/frequent', { params: { limit } }).then(r => r.data);

export const trackWordClick = (wordObject) =>
  api.post('/api/words/track', { wordObjects: [wordObject] }).catch(() => {});

export const getEmotions = () =>
  api.get('/api/emotions').then(r => r.data);

// wordObjects: 사용 이력 추적용 전체 단어 객체 배열 (선택)
export const composeSentence = (words, wordObjects) =>
  api.post('/api/sentence/compose', { words, wordObjects }).then(r => r.data);

export const composeEmotion = (emotion) =>
  api.post('/api/sentence/compose-emotion', { emotion }).then(r => r.data);

export const getProfile = () =>
  api.get('/api/profile').then(r => r.data);

export const updateSettings = (settings) =>
  api.patch('/api/profile/settings', settings).then(r => r.data);

export const getRecentSentences = () =>
  api.get('/api/sentences/recent').then(r => r.data);

export default api;
