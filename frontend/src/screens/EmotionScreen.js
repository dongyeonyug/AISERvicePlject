import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmotionCard from '../components/EmotionCard';
import AIBox from '../components/AIBox';
import { getEmotions, composeEmotion } from '../api/client';

export default function EmotionScreen() {
  const [emotions, setEmotions] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [aiSentence, setAiSentence] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    getEmotions()
      .then(data => setEmotions(data.emotions))
      .catch(() => {});
  }, []);

  const handleSelectEmotion = (item) => {
    setSelectedEmotion(item);
    setAiLoading(true);
    setAiSentence('');
    composeEmotion(item.label)
      .then(data => setAiSentence(data.sentence))
      .catch(() => setAiSentence('지금 그런 기분이에요.'))
      .finally(() => setAiLoading(false));
  };

  const handleSpeak = () => {
    if (!aiSentence) return;
    Alert.alert('말하기', aiSentence);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── 헤더 ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>감정 표현</Text>
          <Text style={styles.headerSub}>지금 기분이 어때요?</Text>
        </View>

        {/* ── 선택된 감정 미리보기 ── */}
        <View style={styles.previewCard}>
          {selectedEmotion ? (
            <>
              <Text style={styles.previewEmoji}>{selectedEmotion.emoji}</Text>
              <Text style={[styles.previewLabel, { color: selectedEmotion.textColor }]}>
                {selectedEmotion.label}
              </Text>
              <Text style={styles.previewHint}>선택된 감정</Text>
            </>
          ) : (
            <Text style={styles.previewPlaceholder}>감정을 선택해 주세요</Text>
          )}
        </View>

        {/* ── 감정 그리드 ── */}
        <SectionLabel>감정을 선택하세요</SectionLabel>
        <View style={styles.grid}>
          {emotions.map(item => (
            <View key={item.id} style={styles.gridCell}>
              <EmotionCard
                item={item}
                onPress={() => handleSelectEmotion(item)}
                selected={selectedEmotion?.id === item.id}
              />
            </View>
          ))}
        </View>

        {/* ── AI 박스 + 말하기 (감정 선택 후 표시) ── */}
        {selectedEmotion && (
          <>
            <AIBox
              sentence={aiSentence}
              loading={aiLoading}
              label="✦ AI 문장 제안"
            />
            <Pressable onPress={handleSpeak} style={styles.speakBtn}>
              <Text style={styles.speakBtnText}>▶ 말하기</Text>
            </Pressable>
          </>
        )}

        <View style={styles.bottomPad} />
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
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#6B5CE7', marginRight: 5 },
  text: { fontSize: 11, fontWeight: '500', color: '#555' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7FF' },
  header: { backgroundColor: '#6B5CE7', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20 },
  headerTitle: { color: '#fff', fontSize: 15, fontWeight: '500' },
  headerSub: { color: '#fff', fontSize: 11, opacity: 0.75, marginTop: 2 },

  previewCard: {
    margin: 12,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E0D9FF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 88,
    justifyContent: 'center',
  },
  previewEmoji: { fontSize: 40, lineHeight: 48 },
  previewLabel: { fontSize: 15, fontWeight: '500', marginTop: 4 },
  previewHint: { fontSize: 11, color: '#AAABE4', marginTop: 2 },
  previewPlaceholder: { fontSize: 13, color: '#C4B8F7' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  gridCell: { width: '33.33%', padding: 4 },

  speakBtn: {
    alignSelf: 'flex-start',
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: '#6B5CE7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  speakBtnText: { color: '#fff', fontSize: 11, fontWeight: '500' },
  bottomPad: { height: 28 },
});
