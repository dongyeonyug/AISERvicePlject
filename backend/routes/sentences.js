const express = require('express');
const router = express.Router();
const sentences = require('../data/sentences');
const wordUsage = require('../data/wordUsage');
const { composeSentence, composeEmotion } = require('../services/gemini');

// POST /api/sentence/compose
router.post('/compose', async (req, res) => {
  const { words, wordObjects } = req.body;
  if (!Array.isArray(words) || words.length === 0) {
    return res.status(400).json({ error: '단어 배열이 필요합니다.' });
  }
  // 단어 사용 이력 기록 (wordObjects가 있을 때만)
  if (Array.isArray(wordObjects) && wordObjects.length > 0) {
    wordUsage.record(wordObjects);
  }
  const sentence = await composeSentence(words);
  res.json({ sentence });
});

// POST /api/sentence/compose-emotion
router.post('/compose-emotion', async (req, res) => {
  const { emotion } = req.body;
  if (!emotion) {
    return res.status(400).json({ error: '감정 값이 필요합니다.' });
  }
  const sentence = await composeEmotion(emotion);
  res.json({ sentence });
});

// GET /api/sentences/recent
router.get('/recent', (_req, res) => {
  res.json({ sentences });
});

module.exports = router;
