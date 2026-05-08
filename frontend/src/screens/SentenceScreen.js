import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import WordCard from '../components/WordCard';
import AIBox from '../components/AIBox';
import { getRecentSentences, composeSentence, getFrequentWords } from '../api/client';

// 서버 가동 초기 또는 API 미연결 시 보여줄 기본값
const DEFAULT_FREQUENT = [
  { id: 'f1', label: '즐겁다', emoji: '😊', category: '감정', color: '#EDE9FF', textColor: '#4C38B6' },
  { id: 'f2', label: '친구',   emoji: '👫', category: '사람', color: '#FBEAF0', textColor: '#993556' },
  { id: 'f3', label: '오늘',   emoji: '📅', category: '행동', color: '#E1F5EE', textColor: '#0F6E56' },
  { id: 'f4', label: '가방',   emoji: '🎒', category: '행동', color: '#E1F5EE', textColor: '#0F6E56' },
  { id: 'f5', label: '숙제',   emoji: '📝', category: '행동', color: '#E1F5EE', textColor: '#0F6E56' },
];

const formatDate = (dateStr) => {
  const diffDays = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  return `${diffDays}일 전`;
};

const DISPLAY_LIMIT = 8;

export default function SentenceScreen() {
  const [selectedWords, setSelectedWords] = useState([]);
  const [aiSentence, setAiSentence] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [recentSentences, setRecentSentences] = useState([]);
  const [frequentWords, setFrequentWords] = useState(DEFAULT_FREQUENT);
  const [sentenceStyle, setSentenceStyle] = useState('simple');

  const refreshFrequent = useCallback(() => {
    getFrequentWords(DISPLAY_LIMIT)
      .then(data => {
        if (data.words.length === 0) return;
        // 서버 데이터가 DISPLAY_LIMIT보다 적으면 DEFAULT_FREQUENT로 채움
        const serverLabels = new Set(data.words.map(w => w.label));
        const padding = DEFAULT_FREQUENT.filter(w => !serverLabels.has(w.label));
        setFrequentWords([...data.words, ...padding].slice(0, DISPLAY_LIMIT));
      })
      .catch(() => {});
  }, []);

  // 탭 포커스 시마다 최신 클릭 데이터 반영
  useFocusEffect(refreshFrequent);

  useEffect(() => {
    getRecentSentences()
      .then(data => setRecentSentences(data.sentences))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedWords.length === 0) {
      setAiSentence('');
      return;
    }
    let cancelled = false;
    setAiLoading(true);
    composeSentence(selectedWords.map(w => w.label), selectedWords, sentenceStyle)
      .then(data => {
        if (!cancelled) {
          setAiSentence(data.sentence);
          refreshFrequent();
        }
      })
      .catch(() => { if (!cancelled) setAiSentence('문장을 만들 수 없어요.'); })
      .finally(() => { if (!cancelled) setAiLoading(false); });
    return () => { cancelled = true; };
  }, [selectedWords, sentenceStyle]);

  const toggleWord = (item) => {
    setSelectedWords(prev => {
      const exists = prev.find(w => w.id === item.id);
      return exists ? prev.filter(w => w.id !== item.id) : [...prev, item];
    });
  };

  const handleSpeak = () => {
    if (!aiSentence) return;
    Alert.alert('말하기', aiSentence);
  };

  const handleSave = () => {
    if (!aiSentence) return;
    setRecentSentences(prev => [
      { id: Date.now(), text: aiSentence, createdAt: new Date().toISOString() },
      ...prev,
    ]);
    Alert.alert('저장 완료', '문장이 저장되었습니다.');
  };

  const handleRetry = () => {
    if (selectedWords.length === 0) return;
    setAiLoading(true);
    composeSentence(selectedWords.map(w => w.label), selectedWords, sentenceStyle)
      .then(data => {
        setAiSentence(data.sentence);
        refreshFrequent();
      })
      .catch(() => setAiSentence('문장을 만들 수 없어요.'))
      .finally(() => setAiLoading(false));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── 헤더 ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>문장 만들기</Text>
          <Text style={styles.headerSub}>단어를 선택해 문장을 완성하세요</Text>
        </View>

        {/* ── 선택 단어 박스 ── */}
        <View style={styles.wordBox}>
          <View style={styles.tagRow}>
            {selectedWords.map(word => (
              <Pressable key={word.id} onPress={() => toggleWord(word)} style={styles.selectedTag}>
                <Text style={styles.selectedTagText}>{word.label} ✕</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => Alert.alert('안내', '홈 화면에서 단어를 선택하세요.')}
              style={styles.addWordBtn}
            >
              <Text style={styles.addWordBtnText}>+ 단어 추가</Text>
            </Pressable>
          </View>
          <View style={styles.wordCountRow}>
            <Text style={styles.wordCount}>{selectedWords.length}개 선택됨</Text>
          </View>
        </View>

    {/* ── 문장 스타일 선택 ── */}
    <View style={styles.styleToggleContainer}>
      <Pressable 
        style={[styles.styleBtn, sentenceStyle === 'simple' && styles.styleBtnActive]}
        onPress={() => setSentenceStyle('simple')}
      >
        <Text style={[styles.styleBtnText, sentenceStyle === 'simple' && styles.styleBtnTextActive]}>간결하게</Text>
      </Pressable>
      <Pressable 
        style={[styles.styleBtn, sentenceStyle === 'detailed' && styles.styleBtnActive]}
        onPress={() => setSentenceStyle('detailed')}
      >
        <Text style={[styles.styleBtnText, sentenceStyle === 'detailed' && styles.styleBtnTextActive]}>상세하게</Text>
      </Pressable>
    </View>

        {/* ── AI 박스 ── */}
        <AIBox sentence={aiSentence} loading={aiLoading} />

        {/* ── 버튼 행 ── */}
        <View style={styles.actionRow}>
          <Pressable onPress={handleSpeak} style={styles.btnSpeak}>
            <Text style={styles.btnSpeakText}>▶ 말하기</Text>
          </Pressable>
          <Pressable onPress={handleSave} style={styles.btnSecondary}>
            <Text style={styles.btnSecondaryText}>저장</Text>
          </Pressable>
          <Pressable onPress={handleRetry} style={styles.btnSecondary}>
            <Text style={styles.btnSecondaryText}>🔄 다시</Text>
          </Pressable>
        </View>

        {/* ── 자주 함께 쓰는 단어 ── */}
        <SectionLabel>자주 함께 쓰는 단어</SectionLabel>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
        >
          {frequentWords.map(item => (
            <View key={item.id ?? item.label} style={styles.carouselCard}>
              <WordCard
                item={item}
                onPress={() => toggleWord(item)}
                selected={selectedWords.some(w => w.label === item.label)}
              />
            </View>
          ))}
        </ScrollView>

        {/* ── 최근 사용한 문장 ── */}
        <SectionLabel>최근 사용한 문장</SectionLabel>
        <View style={styles.recentList}>
          {recentSentences.map(s => (
            <View key={s.id} style={styles.recentItem}>
              <Text style={styles.recentText} numberOfLines={2}>{s.text}</Text>
              <Text style={styles.recentDate}>{formatDate(s.createdAt)}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({ children }) {
  return (
    <View style={labelStyles.row}>
      <View style={labelStyles.dot} />
      <Text style={labelStyles.text}>{children}</Text>
    </View>
  );
}

const labelStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingTop: 14, paddingBottom: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#6B5CE7', marginRight: 5 },
  text: { fontSize: 11, fontWeight: '500', color: '#555' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7FF' },
  header: { backgroundColor: '#6B5CE7', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20 },
  headerTitle: { color: '#fff', fontSize: 15, fontWeight: '500' },
  headerSub: { color: '#fff', fontSize: 11, opacity: 0.75, marginTop: 2 },

  wordBox: {
    margin: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#6B5CE7',
    borderRadius: 14,
    padding: 12,
  },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  selectedTag: {
    backgroundColor: '#6B5CE7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  selectedTagText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  addWordBtn: {
    borderWidth: 1.5,
    borderColor: '#9B8BE8',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#F5F3FF',
  },
  addWordBtnText: { fontSize: 12, color: '#7B6DD4' },
  wordCountRow: { borderTopWidth: 1, borderTopColor: '#F0EDFF', paddingTop: 6 },
  wordCount: { fontSize: 11, color: '#888' },

  actionRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, marginTop: 8 },
  btnSpeak: { backgroundColor: '#6B5CE7', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  btnSpeakText: { color: '#fff', fontSize: 12 },
  btnSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0D9FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  btnSecondaryText: { fontSize: 12, color: '#555' },

  carousel: { paddingHorizontal: 12, paddingVertical: 4, gap: 8 },
  carouselCard: { minWidth: 82 },

  recentList: { paddingHorizontal: 12, paddingBottom: 28, gap: 8 },
  recentItem: {
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#E0D9FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentText: { fontSize: 12, color: '#333', flex: 1 },
  recentDate: { fontSize: 11, color: '#AAABE4', marginLeft: 8, flexShrink: 0 },
  styleToggleContainer: { flexDirection: 'row', paddingHorizontal: 12, gap: 8, justifyContent: 'flex-start', marginTop: 4 },
  styleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0D9FF'
  },
  styleBtnActive: { backgroundColor: '#6B5CE7', borderColor: '#6B5CE7' },
  styleBtnText: { fontSize: 11, color: '#888' },
  styleBtnTextActive: { color: '#fff', fontWeight: '500' },
});
