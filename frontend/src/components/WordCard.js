import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function WordCard({ item, onPress, selected, showBadge }) {
  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <View
        style={[
          styles.card,
          { backgroundColor: item.color },
          selected ? styles.selectedBorder : styles.defaultBorder,
        ]}
      >
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={[styles.label, { color: item.textColor }]}>{item.label}</Text>
      </View>
      {showBadge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>추천</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  card: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  defaultBorder: { borderWidth: 1.5, borderColor: 'transparent' },
  selectedBorder: { borderWidth: 2, borderColor: '#6B5CE7' },
  emoji: { fontSize: 28, lineHeight: 34 },
  label: { fontSize: 13, fontWeight: '500', textAlign: 'center', marginTop: 4 },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#6B5CE7',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    zIndex: 1,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '500' },
});
