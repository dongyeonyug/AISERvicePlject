import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech'; // 1. TTS 라이브러리 추가
import WordCard from '../components/WordCard';
import AIBox from '../components/AIBox';
import SentenceBar from '../components/SentenceBar';
import { getWords, composeSentence, trackWordClick } from '../api/client';

const CATEGORIES = ['전체', '감정', '장소', '행동', '음식', '사람', '자연'];

const getTimeLabel = (hour) => {
  if (hour >= 6 && hour < 9)   return '오전 · 학교 가는 시간';
  if (hour >= 9 && hour < 12) return '오전 · 학교 있는 날';
  if (hour >= 12 && hour < 14) return '점심 시간';
  if (hour >= 14 && hour < 18) return '오후 · 쉬는 시간';
  if (hour >= 18 && hour < 21) return '저녁 시간';
  return '밤 · 쉬는 시간';
};

export default function HomeScreen() {
  const [words, setWords] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [aiSentence, setAiSentence] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sentenceStyle, setSentenceStyle] = useState('simple'); // 'simple' or 'detailed'
  const currentHour = new Date().getHours();

  const loadWords = useCallback(async (category) => {
    try {
      const data = await getWords(
        category === '전체' ? null : category,
        currentHour,
      );
      setWords(data.words);
      setRecommended(data.recommended);
    } catch {
      // 백엔드 미연결 시 빈 상태 유지
    }
  }, [currentHour]);

  useEffect(() => {
    loadWords('전체');
  }, [loadWords]);

  useEffect(() => {
    if (selectedWords.length === 0) {
      setAiSentence('');
      return;
    }
    let cancelled = false;
    setAiLoading(true);
    composeSentence(selectedWords.map(w => w.label), selectedWords, sentenceStyle)
      .then(data  => { if (!cancelled) setAiSentence(data.sentence); })
      .catch(()   => { if (!cancelled) setAiSentence('문장을 만들 수 없어요.'); })
      .finally(()  => { if (!cancelled) setAiLoading(false); });
    return () => { cancelled = true; };
  }, [selectedWords, sentenceStyle]);

  const toggleWord = (item) => {
    const isSelected = selectedWords.some(w => w.id === item.id);
    if (!isSelected) trackWordClick(item);
    setSelectedWords(prev => {
      const exists = prev.find(w => w.id === item.id);
      return exists ? prev.filter(w => w.id !== item.id) : [...prev, item];
    });
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    loadWords(cat);
  };

  // 2. handleSpeak 수정: AI 완성 문장을 TTS로 읽기
  const handleSpeak = () => {
    if (selectedWords.length === 0) return;

    if (aiLoading) {
      Alert.alert('알림', 'AI가 문장을 만드는 중입니다.');
      return;
    }

    // AI 문장이 있으면 읽고, 없으면 선택된 단어들을 나열해서 읽음
    const textToRead = aiSentence || selectedWords.map(w => w.label).join(' ');

    Speech.speak(textToRead, {
      language: 'ko-KR',
      pitch: 1.0,
      rate: 0.85, // 아동이 듣기 적당한 속도
    });
  };

  const handleWordRemove = (word) => {
    setSelectedWords(prev => prev.filter(w => w.id !== word.id));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── 헤더 ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>안녕하세요, 지민님 👋</Text>
          <Text style={styles.headerSub}>{getTimeLabel(currentHour)}</Text>
        </View>

        {/* ── 문장 바 ── */}
        <SentenceBar
          selectedWords={selectedWords}
          onSpeak={handleSpeak}
          onWordRemove={handleWordRemove}
        />

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

        {/* ── 추천 단어 캐러셀 ── */}
        <SectionLabel>지금 이 시간 추천 단어</SectionLabel>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
        >
          {recommended.map(item => (
            <View key={item.id} style={styles.carouselCard}>
              <WordCard
                item={item}
                onPress={() => toggleWord(item)}
                selected={selectedWords.some(w => w.id === item.id)}
                showBadge
              />
            </View>
          ))}
        </ScrollView>

        {/* ── 카테고리 탭 ── */}
        <SectionLabel>카테고리</SectionLabel>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {CATEGORIES.map(cat => (
            <Pressable
              key={cat}
              onPress={() => handleCategoryChange(cat)}
              style={[styles.tab, selectedCategory === cat && styles.tabActive]}
            >
              <Text style={[styles.tabText, selectedCategory === cat && styles.tabTextActive]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── 단어 그리드 (4열) ── */}
        <View style={styles.grid}>
          {words.map(item => (
            <View key={item.id} style={styles.gridCell}>
              <WordCard
                item={item}
                onPress={() => toggleWord(item)}
                selected={selectedWords.some(w => w.id === item.id)}
              />
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
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#6B5CE7', marginRight: 5 },
  text: { fontSize: 11, fontWeight: '500', color: '#555' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7FF' },
  header: { backgroundColor: '#6B5CE7', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20 },
  headerTitle: { color: '#fff', fontSize: 15, fontWeight: '500' },
  headerSub: { color: '#fff', fontSize: 11, opacity: 0.75, marginTop: 2 },
  carousel: { paddingHorizontal: 12, paddingVertical: 4, gap: 8 },
  carouselCard: { minWidth: 82 },
  tabs: { paddingHorizontal: 12, paddingBottom: 4, gap: 6 },
  tab: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0D9FF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tabActive: { backgroundColor: '#6B5CE7', borderColor: '#6B5CE7' },
  tabText: { fontSize: 11, color: '#888' },
  tabTextActive: { color: '#fff', fontWeight: '500' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8, paddingBottom: 24 },
  gridCell: { width: '25%', padding: 4 },
  styleToggleContainer: { flexDirection: 'row', paddingHorizontal: 12, marginTop: 12, gap: 8, justifyContent: 'flex-start' },
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