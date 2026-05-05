import { View, Text, StyleSheet } from 'react-native';

export default function AIBox({ sentence, loading, label = '✦ AI 문장 완성' }) {
  const isPlaceholder = !loading && !sentence;
  const displayText = loading
    ? '문장을 만들고 있어요...'
    : sentence || '단어를 선택하면 AI가 문장을 완성해드려요.';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.sentence, isPlaceholder && styles.placeholder]}>
        {displayText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: '#F5F3FF',
    borderLeftWidth: 3,
    borderLeftColor: '#6B5CE7',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 12,
  },
  label: { fontSize: 10, color: '#7B6DD4', fontWeight: '500', marginBottom: 4 },
  sentence: { fontSize: 15, fontWeight: '500', color: '#1A1A2E', lineHeight: 22 },
  placeholder: { color: '#C4B8F7', fontWeight: '400' },
});
