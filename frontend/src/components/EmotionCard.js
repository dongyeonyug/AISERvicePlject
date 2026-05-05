import { Pressable, Text, StyleSheet } from 'react-native';

export default function EmotionCard({ item, onPress, selected }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: item.color },
        selected ? styles.selectedBorder : styles.defaultBorder,
      ]}
    >
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={[styles.label, { color: item.textColor }]}>{item.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  defaultBorder: { borderWidth: 1.5, borderColor: 'transparent' },
  selectedBorder: { borderWidth: 2, borderColor: '#6B5CE7' },
  emoji: { fontSize: 28, lineHeight: 34 },
  label: { fontSize: 12, fontWeight: '500', textAlign: 'center', marginTop: 4 },
});
