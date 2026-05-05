import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Switch, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getProfile, updateSettings } from '../api/client';

const CARD_SIZE_OPTS  = ['작게', '보통', '크게'];
const FONT_SIZE_OPTS  = ['작게', '보통', '크게'];
const SPEECH_OPTS     = ['느리게', '보통', '빠르게'];

export default function SettingsScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then(data => setProfile(data.profile))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSettingChange = async (key, value) => {
    setProfile(prev => ({ ...prev, settings: { ...prev.settings, [key]: value } }));
    try {
      await updateSettings({ [key]: value });
    } catch {
      // 실패 시 이전 값 복원은 생략 (프로토타입)
    }
  };

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>설정 및 개인화</Text>
          <Text style={styles.headerSub}>맞춤 설정</Text>
        </View>
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingText}>불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { stats, settings, guardians } = profile;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── 헤더 ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>설정 및 개인화</Text>
          <Text style={styles.headerSub}>맞춤 설정</Text>
        </View>

        {/* ── 프로필 카드 ── */}
        <View style={styles.card}>
          <SectionTitle icon="👤" title="프로필" />
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>{profile.avatar}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileSub}>{profile.grade} · {profile.type}</Text>
            </View>
          </View>

          <SectionTitle icon="📊" title="학습 현황" />
          <View style={styles.statsRow}>
            <StatCard value={stats.wordCount} label="등록 단어" bg="#EDE9FF" color="#4C38B6" />
            <StatCard value={`${stats.accuracy}%`} label="정확도" bg="#E1F5EE" color="#0F6E56" />
            <StatCard value={`${stats.streak}일`} label="연속 사용" bg="#FAEEDA" color="#854F0B" />
          </View>
        </View>

        {/* ── 인터페이스 설정 ── */}
        <View style={styles.card}>
          <SectionTitle icon="🎨" title="인터페이스" />
          <OptionRow
            label="카드 크기"
            options={CARD_SIZE_OPTS}
            selected={settings.cardSize}
            onSelect={v => handleSettingChange('cardSize', v)}
          />
          <OptionRow
            label="글자 크기"
            options={FONT_SIZE_OPTS}
            selected={settings.fontSize}
            onSelect={v => handleSettingChange('fontSize', v)}
          />
          <OptionRow
            label="음성 속도"
            options={SPEECH_OPTS}
            selected={settings.speechSpeed}
            onSelect={v => handleSettingChange('speechSpeed', v)}
          />
        </View>

        {/* ── AI 개인화 ── */}
        <View style={styles.card}>
          <SectionTitle icon="🤖" title="AI 개인화" />
          <ToggleRow
            label="습관 학습"
            desc="사용 패턴으로 추천 개선"
            value={settings.habitLearning}
            onToggle={v => handleSettingChange('habitLearning', v)}
          />
          <ToggleRow
            label="상황 인지 추천"
            desc="시간대별 단어 자동 배치"
            value={settings.contextRecommend}
            onToggle={v => handleSettingChange('contextRecommend', v)}
          />
        </View>

        {/* ── 보호자 관리 ── */}
        <View style={styles.card}>
          <SectionTitle icon="👨‍👩‍👧" title="보호자 관리" />
          {(guardians ?? []).map(g => (
            <View key={g.id} style={styles.guardianRow}>
              <View style={styles.guardianAvatar}>
                <Text>{g.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.guardianName}>{g.name}</Text>
                <Text style={styles.guardianRole}>{g.role} · 알림 수신 중</Text>
              </View>
              <Pressable>
                <Text style={styles.editLink}>편집</Text>
              </Pressable>
            </View>
          ))}
          <Pressable
            onPress={() => Alert.alert('안내', '준비 중인 기능입니다.')}
            style={styles.addGuardianBtn}
          >
            <Text style={styles.addGuardianText}>+ 보호자 추가</Text>
          </Pressable>
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ── 소형 컴포넌트 ── */

function SectionTitle({ icon, title }) {
  return (
    <Text style={titleStyles.text}>{icon} {title}</Text>
  );
}
const titleStyles = StyleSheet.create({
  text: { fontSize: 11, fontWeight: '500', color: '#7B6DD4', marginBottom: 10 },
});

function StatCard({ value, label, bg, color }) {
  return (
    <View style={[statStyles.card, { backgroundColor: bg }]}>
      <Text style={[statStyles.value, { color }]}>{value}</Text>
      <Text style={[statStyles.label, { color }]}>{label}</Text>
    </View>
  );
}
const statStyles = StyleSheet.create({
  card: { flex: 1, borderRadius: 10, padding: 8, alignItems: 'center' },
  value: { fontSize: 18, fontWeight: '500' },
  label: { fontSize: 10, marginTop: 2 },
});

function OptionRow({ label, options, selected, onSelect }) {
  return (
    <View style={optStyles.row}>
      <Text style={optStyles.label}>{label}</Text>
      <View style={optStyles.group}>
        {options.map(opt => (
          <Pressable
            key={opt}
            onPress={() => onSelect(opt)}
            style={[optStyles.btn, selected === opt && optStyles.btnActive]}
          >
            <Text style={[optStyles.btnText, selected === opt && optStyles.btnTextActive]}>
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
const optStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  label: { fontSize: 12, color: '#333' },
  group: { flexDirection: 'row', gap: 4 },
  btn: {
    borderWidth: 0.5,
    borderColor: '#E0D9FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#fff',
  },
  btnActive: { backgroundColor: '#EDE9FF', borderColor: '#6B5CE7', borderWidth: 1.5 },
  btnText: { fontSize: 11, color: '#888' },
  btnTextActive: { color: '#4C38B6', fontWeight: '500' },
});

function ToggleRow({ label, desc, value, onToggle }) {
  return (
    <View style={toggleStyles.row}>
      <View style={{ flex: 1 }}>
        <Text style={toggleStyles.label}>{label}</Text>
        <Text style={toggleStyles.desc}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E0D9FF', true: '#6B5CE7' }}
        thumbColor="#fff"
      />
    </View>
  );
}
const toggleStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  label: { fontSize: 12, color: '#333' },
  desc: { fontSize: 10, color: '#AAA', marginTop: 1 },
});

/* ── 메인 스타일 ── */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7FF' },
  header: { backgroundColor: '#6B5CE7', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20 },
  headerTitle: { color: '#fff', fontSize: 15, fontWeight: '500' },
  headerSub: { color: '#fff', fontSize: 11, opacity: 0.75, marginTop: 2 },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 13, color: '#7B6DD4' },

  card: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#E0D9FF',
    borderRadius: 14,
    padding: 14,
  },

  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  avatar: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: '#EDE9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 18 },
  profileName: { fontSize: 13, fontWeight: '500', color: '#1A1A2E' },
  profileSub: { fontSize: 11, color: '#888', marginTop: 1 },
  statsRow: { flexDirection: 'row', gap: 8 },

  guardianRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  guardianAvatar: {
    width: 32, height: 32,
    borderRadius: 16,
    backgroundColor: '#E1F5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guardianName: { fontSize: 12, color: '#333' },
  guardianRole: { fontSize: 10, color: '#888', marginTop: 1 },
  editLink: { fontSize: 11, color: '#6B5CE7' },
  addGuardianBtn: {
    backgroundColor: '#F5F3FF',
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
  },
  addGuardianText: { fontSize: 11, color: '#7B6DD4' },
});
