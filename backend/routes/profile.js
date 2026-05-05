const express = require('express');
const router = express.Router();

const profile = {
  name: '김지민',
  avatar: '👧',
  grade: '초등학교 3학년',
  type: '언어 장애',
  stats: { wordCount: 247, accuracy: 83, streak: 14 },
  settings: {
    cardSize: '보통',
    fontSize: '보통',
    speechSpeed: '보통',
    habitLearning: true,
    contextRecommend: true,
  },
  guardians: [
    { id: 1, name: '엄마 (김현주)', emoji: '👩', role: '보호자', notify: true },
  ],
};

// GET /api/profile
router.get('/', (_req, res) => {
  res.json({ profile });
});

// PATCH /api/profile/settings
router.patch('/settings', (req, res) => {
  Object.assign(profile.settings, req.body);
  res.json({ settings: profile.settings });
});

module.exports = router;
