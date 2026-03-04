import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscription } from '../context/SubscriptionContext';
import { SESSIONS, CATEGORIES, Session, Category } from '../data/sessions';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface Props {
  onOpenPaywall: () => void;
}

function formatPlays(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function SessionCard({
  session,
  locked,
  onPress,
}: {
  session: Session;
  locked: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={locked ? 0.6 : 0.85}
      style={styles.cardWrap}
      testID={`session-card-${session.id}`}
    >
      <LinearGradient
        colors={locked ? ['#1C1C2E', '#2A2A40'] : session.gradient}
        style={[styles.card, locked && styles.cardLocked]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Lock overlay */}
        {locked && (
          <View style={styles.lockOverlay} testID={`lock-overlay-${session.id}`}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}

        {/* Emoji */}
        <View style={[styles.emojiWrap, locked && styles.emojiWrapLocked]}>
          <Text style={styles.cardEmoji}>{session.emoji}</Text>
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <Text
            style={[styles.cardTitle, locked && styles.cardTitleLocked]}
            numberOfLines={2}
          >
            {session.title}
          </Text>
          <Text
            style={[styles.cardSubtitle, locked && styles.cardSubtitleLocked]}
            numberOfLines={1}
          >
            {session.subtitle}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.durationBadge}>
            <Text style={[styles.durationText, locked && styles.durationTextLocked]}>
              {session.duration} мин
            </Text>
          </View>
          {!locked && (
            <Text style={styles.ratingText}>⭐ {session.rating}</Text>
          )}
          {locked && (
            <View style={styles.premiumBadge} testID={`premium-badge-${session.id}`}>
              <Text style={styles.premiumBadgeText}>Premium</Text>
            </View>
          )}
        </View>

        {/* Plays count */}
        {!locked && (
          <Text style={styles.playsText}>{formatPlays(session.plays)} сессий</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function MeditationsScreen({ onOpenPaywall }: Props) {
  const { isPremium } = useSubscription();
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const filtered = activeCategory === 'all'
    ? SESSIONS
    : SESSIONS.filter(s => s.category === activeCategory);

  const handleCardPress = (session: Session) => {
    const locked = session.isPremium && !isPremium;
    if (locked) {
      onOpenPaywall();
    } else {
      console.log('Open session:', session.title);
    }
  };

  const freeCount = SESSIONS.filter(s => !s.isPremium).length;
  const premiumCount = SESSIONS.filter(s => s.isPremium).length;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#0A0A1A', '#12073A', '#0A1628']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
      {/* Glow blobs */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Добро пожаловать 👋</Text>
            <Text style={styles.title}>Медитации</Text>
          </View>
          {isPremium ? (
            <View style={styles.premiumTag} testID="premium-tag">
              <LinearGradient
                colors={['#6C63FF', '#4ECDC4']}
                style={styles.premiumTagGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.premiumTagText}>👑 Premium</Text>
              </LinearGradient>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.unlockBtn}
              onPress={onOpenPaywall}
              testID="unlock-button"
            >
              <LinearGradient
                colors={['#6C63FF', '#4ECDC4']}
                style={styles.unlockBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.unlockBtnText}>Разблокировать</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats bar */}
        {!isPremium && (
          <View style={styles.statsBar} testID="stats-bar">
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{freeCount}</Text>
              <Text style={styles.statLabel}>Бесплатно</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, styles.statNumLocked]}>🔒 {premiumCount}</Text>
              <Text style={styles.statLabel}>Premium</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{SESSIONS.length}</Text>
              <Text style={styles.statLabel}>Всего</Text>
            </View>
          </View>
        )}

        {/* Category filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categories}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                testID={`category-${cat.id}`}
                activeOpacity={0.8}
              >
                {isActive ? (
                  <LinearGradient
                    colors={['#6C63FF', '#4ECDC4']}
                    style={styles.categoryPill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                    <Text style={styles.categoryLabelActive}>{cat.label}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.categoryPillInactive}>
                    <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Sessions grid */}
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <SessionCard
              session={item}
              locked={item.isPremium && !isPremium}
              onPress={() => handleCardPress(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Нет сессий в этой категории</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A1A' },
  safe: { flex: 1 },
  blob: { position: 'absolute', borderRadius: 999 },
  blob1: { width: 300, height: 300, backgroundColor: 'rgba(108,99,255,0.15)', top: -60, right: -80 },
  blob2: { width: 250, height: 250, backgroundColor: 'rgba(78,205,196,0.1)', bottom: 200, left: -60 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  greeting: { fontSize: 13, color: '#A09DB8', marginBottom: 2 },
  title: { fontSize: 28, fontWeight: '800', color: '#F0EEFF', letterSpacing: -0.5 },
  premiumTag: { borderRadius: 12, overflow: 'hidden' },
  premiumTagGradient: { paddingHorizontal: 12, paddingVertical: 6 },
  premiumTagText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  unlockBtn: { borderRadius: 12, overflow: 'hidden' },
  unlockBtnGradient: { paddingHorizontal: 14, paddingVertical: 8 },
  unlockBtnText: { fontSize: 12, fontWeight: '700', color: '#FFF' },

  // Stats bar
  statsBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: '800', color: '#F0EEFF', marginBottom: 2 },
  statNumLocked: { fontSize: 14 },
  statLabel: { fontSize: 11, color: '#605C7A' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.08)' },

  // Categories
  categories: { maxHeight: 48, marginBottom: 16 },
  categoriesContent: { paddingHorizontal: 20, gap: 8 },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  categoryPillInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 4,
  },
  categoryEmoji: { fontSize: 14 },
  categoryLabel: { fontSize: 13, color: '#A09DB8', fontWeight: '500' },
  categoryLabelActive: { fontSize: 13, color: '#FFF', fontWeight: '700' },

  // Grid
  grid: { paddingHorizontal: 16, paddingBottom: 32 },
  row: { justifyContent: 'space-between', marginBottom: 12 },

  // Card
  cardWrap: { width: CARD_WIDTH },
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    padding: 16,
    minHeight: 200,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardLocked: { opacity: 0.75 },
  lockOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: { fontSize: 16 },
  emojiWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emojiWrapLocked: { backgroundColor: 'rgba(255,255,255,0.08)' },
  cardEmoji: { fontSize: 26 },
  cardInfo: { flex: 1, marginBottom: 10 },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 20,
  },
  cardTitleLocked: { color: '#6B6880' },
  cardSubtitle: { fontSize: 11, color: 'rgba(255,255,255,0.65)' },
  cardSubtitleLocked: { color: '#3D3A52' },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  durationBadge: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  durationText: { fontSize: 11, color: '#FFFFFF', fontWeight: '600' },
  durationTextLocked: { color: '#4A4760' },
  ratingText: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  premiumBadge: {
    backgroundColor: 'rgba(108,99,255,0.3)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(108,99,255,0.5)',
  },
  premiumBadgeText: { fontSize: 10, color: '#9D97FF', fontWeight: '700' },
  playsText: { fontSize: 10, color: 'rgba(255,255,255,0.5)' },

  // Empty
  empty: { flex: 1, alignItems: 'center', paddingTop: 60 },
  emptyText: { color: '#605C7A', fontSize: 15 },
});
