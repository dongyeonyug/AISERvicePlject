const express = require('express');
const router = express.Router();
const words = require('../data/words');
const wordUsage = require('../data/wordUsage');

// GET /api/words/frequent  ← 반드시 GET / 보다 먼저 등록
router.get('/frequent', (req, res) => {
  const limit = parseInt(req.query.limit ?? '5', 10);
  res.json({ words: wordUsage.getTop(limit) });
});

// POST /api/words/track — 홈화면 단어 클릭 이력 기록
router.post('/track', (req, res) => {
  const { wordObjects } = req.body;
  if (Array.isArray(wordObjects) && wordObjects.length > 0) {
    wordUsage.record(wordObjects);
  }
  res.json({ ok: true });
});

// GET /api/words?category=장소&hour=9
router.get('/', (req, res) => {
  const { category, hour } = req.query;

  let filtered = [...words];

  if (category) {
    filtered = filtered.filter(w => w.category === category);
  }

  let recommended = [];
  if (hour !== undefined) {
    const h = parseInt(hour, 10);
    const hourWords = words.filter(w => w.recommendedHours.includes(h));
    recommended = hourWords.slice(0, 5);
  }

  res.json({ recommended, words: filtered });
});

module.exports = router;
