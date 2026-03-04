import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  ActivityIndicator,
  Clipboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  generateMoodAffirmation,
  MOOD_OPTIONS,
  Mood,
  MoodOption,
} from '../services/grok';

interface Props {
  onBack: () => void;
}

type ScreenState = 'select' | 'loading' | 'result' | 'error';

const MOOD_GRADIENTS: Record<Mood, readonly [string, string]> = {
  calm: ['#4ECDC4', '#44A08D'],
  anxious: ['#6C63FF', '#9D97FF'],
  energetic: ['#F7971E', '#FFD200'],
};

const MOOD_BG_GLOW: Record<Mood, string> = {
  calm: 'rgba(78,205,196,0.18)',
  anxious: 'rgba(108,99,255,0.18)',
  energetic: 'rgba(247,151,30,0.18)',
};

export default function AIMoodScreen({ onBack }: Props) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [state, setState] = useState<ScreenState>('select');
  const [affirmation, setAffirmation] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for loading
  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopPulse = () => {
    pulseAnim.stopAnimation();
    Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  };

  const animateIn = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.9);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
    ]).start();
  };

  const handleGenerate = async () => {
    if (!selectedMood) return;
    setState('loading');
    startPulse();

    const result = await generateMoodAffirmation(selectedMood);

    stopPulse();

    if (result.error) {
      setErrorMsg(result.error);
      setState('error');
    } else {
      setAffirmation(result.text);
      setState('result');
      animateIn();
    }
  };

  const handleReset = () => {
    setState('select');
    setSelectedMood(null);
    setAffirmation('');
    setErrorMsg('');
    setCopied(false);
  };

  const handleCopy = () => {
    Clipboard.setString(affirmation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeMood = selectedMood ? MOOD_OPTIONS.find(m => m.id === selectedMood) : null;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#0A0A1A', '#12073A', '#0A1628']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      {/* Glow blob — color changes with mood */}
      <View
        style={[
          styles.glowBlob,
          {
            backgroundColor: selectedMood
              ? MOOD_BG_GLOW[selectedMood]
              : 'rgba(108,99,255,0.12)',
          },
        ]}
      />

      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            testID="back-button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.backText}>← Назад</Text>
          </TouchableOpacity>
          <View style={styles.headerBadge}>
            <LinearGradient
              colors={['#6C63FF', '#4ECDC4']}
              style={styles.headerBadgeGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.headerBadgeText}>✨ AI Настрой дня</Text>
            </LinearGradient>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text style={styles.title}>Как ты себя{'\n'}чувствуешь?</Text>
          <Text style={styles.subtitle}>
            Выбери своё настроение — AI создаст{'\n'}персональную аффирмацию
          </Text>

          {/* Mood selector */}
          <View style={styles.moodRow} testID="mood-selector">
            {MOOD_OPTIONS.map((mood: MoodOption) => {
              const isSelected = selectedMood === mood.id;
              return (
                <TouchableOpacity
                  key={mood.id}
                  testID={`mood-${mood.id}`}
                  onPress={() => setSelectedMood(mood.id)}
                  activeOpacity={0.8}
                  style={styles.moodCardWrap}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={MOOD_GRADIENTS[mood.id]}
                      style={styles.moodCard}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                      <Text style={styles.moodLabelSelected}>{mood.label}</Text>
                      <Text style={styles.moodDescSelected}>{mood.description}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.moodCardInactive}>
                      <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                      <Text style={styles.moodLabel}>{mood.label}</Text>
                      <Text style={styles.moodDesc}>{mood.description}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Generate button */}
          {state !== 'loading' && state !== 'result' && (
            <TouchableOpacity
              testID="generate-button"
              onPress={handleGenerate}
              disabled={!selectedMood}
              activeOpacity={0.85}
              style={[styles.generateBtnWrap, !selectedMood && styles.generateBtnDisabled]}
            >
              <LinearGradient
                colors={selectedMood ? MOOD_GRADIENTS[selectedMood] : ['#333', '#444']}
                style={styles.generateBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.generateBtnText}>
                  {selectedMood
                    ? `Сгенерировать для «${activeMood?.label}»`
                    : 'Выбери настроение'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Loading state */}
          {state === 'loading' && (
            <Animated.View
              style={[styles.loadingWrap, { transform: [{ scale: pulseAnim }] }]}
              testID="loading-indicator"
            >
              <LinearGradient
                colors={
                  selectedMood
                    ? MOOD_GRADIENTS[selectedMood]
                    : ['#6C63FF', '#4ECDC4']
                }
                style={styles.loadingCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <ActivityIndicator size="large" color="#FFF" />
                <Text style={styles.loadingText}>AI создаёт аффирмацию...</Text>
                <Text style={styles.loadingSubtext}>
                  {activeMood?.emoji} {activeMood?.label}
                </Text>
              </LinearGradient>
            </Animated.View>
          )}

          {/* Result state */}
          {state === 'result' && (
            <Animated.View
              style={[
                styles.resultWrap,
                { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
              ]}
              testID="result-card"
            >
              {/* Mood indicator */}
              <View style={styles.resultMoodRow}>
                <LinearGradient
                  colors={MOOD_GRADIENTS[selectedMood!]}
                  style={styles.resultMoodBadge}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.resultMoodText}>
                    {activeMood?.emoji} {activeMood?.label}
                  </Text>
                </LinearGradient>
              </View>

              {/* Affirmation text card */}
              <View style={styles.affirmationCard}>
                <LinearGradient
                  colors={['rgba(108,99,255,0.12)', 'rgba(78,205,196,0.06)']}
                  style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
                />
                <Text style={styles.quoteIcon}>"</Text>
                <Text style={styles.affirmationText} testID="affirmation-text">
                  {affirmation}
                </Text>
                <Text style={styles.quoteIconEnd}>"</Text>
              </View>

              {/* Action buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={handleCopy}
                  testID="copy-button"
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                    style={styles.copyBtnGrad}
                  >
                    <Text style={styles.copyBtnText}>
                      {copied ? '✓ Скопировано' : '📋 Скопировать'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.regenerateBtn}
                  onPress={handleGenerate}
                  testID="regenerate-button"
                >
                  <LinearGradient
                    colors={MOOD_GRADIENTS[selectedMood!]}
                    style={styles.regenerateBtnGrad}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.regenerateBtnText}>🔄 Ещё раз</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Try another mood */}
              <TouchableOpacity
                onPress={handleReset}
                testID="reset-button"
                style={styles.resetBtn}
              >
                <Text style={styles.resetBtnText}>Изменить настроение</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Error state */}
          {state === 'error' && (
            <View style={styles.errorWrap} testID="error-card">
              <View style={styles.errorCard}>
                <Text style={styles.errorEmoji}>⚠️</Text>
                <Text style={styles.errorTitle}>Что-то пошло не так</Text>
                <Text style={styles.errorText} testID="error-message">
                  {errorMsg}
                </Text>
                <TouchableOpacity
                  style={styles.errorRetryBtn}
                  onPress={handleReset}
                  testID="error-retry-button"
                >
                  <Text style={styles.errorRetryText}>Попробовать снова</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A1A' },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 48 },

  glowBlob: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    top: -60,
    right: -80,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backText: { color: '#A09DB8', fontSize: 15, fontWeight: '500' },
  headerBadge: { borderRadius: 12, overflow: 'hidden' },
  headerBadgeGrad: { paddingHorizontal: 12, paddingVertical: 6 },
  headerBadgeText: { fontSize: 12, fontWeight: '700', color: '#FFF' },

  // Title
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F0EEFF',
    letterSpacing: -0.8,
    marginTop: 20,
    marginBottom: 10,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 15,
    color: '#7A78A0',
    lineHeight: 22,
    marginBottom: 32,
  },

  // Mood cards
  moodRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  moodCardWrap: { flex: 1 },
  moodCard: {
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  moodCardInactive: {
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  moodEmoji: { fontSize: 34, marginBottom: 8 },
  moodLabel: { fontSize: 13, fontWeight: '700', color: '#A09DB8', marginBottom: 4 },
  moodLabelSelected: { fontSize: 13, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  moodDesc: { fontSize: 10, color: '#5A5870', textAlign: 'center', minHeight: 28 },
  moodDescSelected: { fontSize: 10, color: 'rgba(255,255,255,0.8)', textAlign: 'center', minHeight: 28 },

  // Generate button
  generateBtnWrap: { borderRadius: 18, overflow: 'hidden', marginBottom: 8 },
  generateBtnDisabled: { opacity: 0.4 },
  generateBtn: { paddingVertical: 18, alignItems: 'center', borderRadius: 18 },
  generateBtnText: { fontSize: 16, fontWeight: '800', color: '#FFF', letterSpacing: -0.3 },

  // Loading
  loadingWrap: { marginTop: 8 },
  loadingCard: {
    borderRadius: 24,
    padding: 36,
    alignItems: 'center',
    gap: 16,
  },
  loadingText: { fontSize: 16, fontWeight: '700', color: '#FFF', marginTop: 8 },
  loadingSubtext: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },

  // Result
  resultWrap: { marginTop: 8, gap: 16 },
  resultMoodRow: { alignItems: 'flex-start' },
  resultMoodBadge: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 7 },
  resultMoodText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

  affirmationCard: {
    borderRadius: 24,
    padding: 28,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  quoteIcon: {
    fontSize: 48,
    color: 'rgba(108,99,255,0.4)',
    fontWeight: '900',
    lineHeight: 52,
    marginBottom: 4,
  },
  quoteIconEnd: {
    fontSize: 48,
    color: 'rgba(78,205,196,0.4)',
    fontWeight: '900',
    lineHeight: 52,
    textAlign: 'right',
    marginTop: 4,
  },
  affirmationText: {
    fontSize: 18,
    color: '#E8E5FF',
    lineHeight: 28,
    fontWeight: '500',
    fontStyle: 'italic',
  },

  // Action row
  actionRow: { flexDirection: 'row', gap: 10 },
  copyBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  copyBtnGrad: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  copyBtnText: { fontSize: 14, fontWeight: '600', color: '#A09DB8' },
  regenerateBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  regenerateBtnGrad: { paddingVertical: 14, alignItems: 'center', borderRadius: 14 },
  regenerateBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

  resetBtn: { alignItems: 'center', paddingVertical: 8 },
  resetBtnText: { fontSize: 14, color: '#605C7A', fontWeight: '500' },

  // Error
  errorWrap: { marginTop: 8 },
  errorCard: {
    backgroundColor: 'rgba(255,80,80,0.08)',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,80,80,0.2)',
    gap: 10,
  },
  errorEmoji: { fontSize: 36 },
  errorTitle: { fontSize: 17, fontWeight: '700', color: '#FF8080' },
  errorText: { fontSize: 13, color: '#A09DB8', textAlign: 'center', lineHeight: 20 },
  errorRetryBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
  },
  errorRetryText: { fontSize: 14, fontWeight: '600', color: '#A09DB8' },
});
