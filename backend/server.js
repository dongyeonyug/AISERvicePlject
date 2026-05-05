require('dotenv').config();
const express = require('express');
const cors = require('cors');

const wordsRouter = require('./routes/words');
const sentencesRouter = require('./routes/sentences');
const profileRouter = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/words', wordsRouter);
app.use('/api/sentence', sentencesRouter);
app.use('/api/sentences', sentencesRouter);
app.use('/api/profile', profileRouter);

app.get('/api/emotions', (_req, res) => {
  res.json({ emotions: require('./data/emotions') });
});

app.listen(PORT, () => {
  console.log(`AAC 백엔드 서버가 포트 ${PORT}에서 실행 중입니다.`);
});
