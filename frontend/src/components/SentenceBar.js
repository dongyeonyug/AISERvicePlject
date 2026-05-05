import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';

export default function SentenceBar({ selectedWords = [], onSpeak, onWordRemove }) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        style={{ flex: 1 }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {selectedWords.length === 0 ? (
          <Text style={styles.placeholder}>단어를 선택하세요...</Text>
        ) : (
          selectedWords.map(word => (
            <Pressable
              key={word.id}
              onPress={() => onWordRemove?.(word)}
              style={styles.tag}
            >
              <Text style={styles.tagText}>{word.label}</Text>
            </Pressable>
          ))
        )}
      </ScrollView>
      <Pressable onPress={onSpeak} style={styles.speakBtn}>
        <Text style={styles.speakBtnText}>▶ 말하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0D9FF',
    gap: 8,
  },
  scrollContent: { alignItems: 'center', gap: 6 },
  placeholder: { fontSize: 12, color: '#C4B8F7', paddingVertical: 4 },
  tag: {
    backgroundColor: '#EDE9FF',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  tagText: { fontSize: 12, color: '#5340C9', fontWeight: '500' },
  speakBtn: {
    backgroundColor: '#6B5CE7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexShrink: 0,
  },
  speakBtnText: { color: '#fff', fontSize: 11, fontWeight: '500' },
});
