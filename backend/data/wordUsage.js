// 서버 가동 중 단어 사용 횟수를 메모리에 누적한다.
// 재시작 시 초기화되는 것은 의도된 동작.
const usage = new Map(); // label → { count, data }

function record(wordObjects) {
  for (const w of wordObjects) {
    const entry = usage.get(w.label);
    if (entry) {
      entry.count += 1;
    } else {
      usage.set(w.label, { count: 1, data: w });
    }
  }
}

function getTop(n = 5) {
  return [...usage.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, n)
    .map(v => v.data);
}

module.exports = { record, getTop };
