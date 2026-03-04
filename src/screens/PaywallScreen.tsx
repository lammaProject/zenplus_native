import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Modal,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const BENEFITS = [
  { icon: '🧘', title: 'Безлимитные медитации', desc: 'Доступ ко всей библиотеке 200+ сессий' },
  { icon: '🤖', title: 'AI-рекомендации', desc: 'Персональный план под ваше настроение' },
  { icon: '😴', title: 'Сон и восстановление', desc: 'Эксклюзивные программы для глубокого сна' },
  { icon: '📊', title: 'Подробная аналитика', desc: 'Графики прогресса и статистика практик' },
  { icon: '🎵', title: 'Бинауральные ритмы', desc: 'Звуки для фокуса, сна и медитации' },
  { icon: '🌿', title: 'Офлайн доступ', desc: 'Медитируйте без интернета в любом месте' },
];

const PLANS = [
  {
    id: 'monthly',
    label: 'Месячный',
    price: '599 ₽',
    period: '/ месяц',
    pricePerMonth: '599 ₽/мес',
    badge: null,
    description: 'Попробуй и реши',
  },
  {
    id: 'yearly',
    label: 'Годовой',
    price: '2 990 ₽',
    period: '/ год',
    pricePerMonth: '249 ₽/мес',
    badge: 'ВЫГОДА 58%',
    description: 'Самый популярный',
  },
];

interface Props {
  onSuccess?: () => void;
  onBack?: () => void;
}

export default function PaywallScreen({ onSuccess, onBack }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePurchase = () => {
    setLoading(true);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
    }, 1500);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onSuccess?.();
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
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
        {/* Back button */}
        {onBack && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBack}
            testID="back-button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.backBtnText}>← Назад</Text>
          </TouchableOpacity>
        )}
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.crownWrap}>
              <Text style={styles.crownEmoji}>👑</Text>
            </View>
            <Text style={styles.title}>ZenPulse Premium</Text>
            <Text style={styles.subtitle}>
              Раскрой полный потенциал{'\n'}своей практики
            </Text>
          </View>

          {/* Benefits */}
          <View style={styles.benefitsCard}>
            <LinearGradient
              colors={['rgba(108,99,255,0.15)', 'rgba(78,205,196,0.08)']}
              style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
            />
            {BENEFITS.map((b, i) => (
              <View key={i} style={[styles.benefitRow, i < BENEFITS.length - 1 && styles.benefitBorder]}>
                <View style={styles.benefitIcon}>
                  <Text style={styles.benefitEmoji}>{b.icon}</Text>
                </View>
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>{b.title}</Text>
                  <Text style={styles.benefitDesc}>{b.desc}</Text>
                </View>
                <Text style={styles.checkmark}>✓</Text>
              </View>
            ))}
          </View>

          {/* Plans */}
          <Text style={styles.plansTitle}>Выбери план</Text>
          <View style={styles.plansRow}>
            {PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={styles.planWrap}
                  onPress={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
                  activeOpacity={0.85}
                  testID={`plan-${plan.id}`}
                >
                  {isSelected && (
                    <LinearGradient
                      colors={['#6C63FF', '#4ECDC4']}
                      style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                  )}
                  <LinearGradient
                    colors={
                      isSelected
                        ? ['transparent', 'transparent']
                        : ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']
                    }
                    style={[styles.planCard, isSelected && styles.planCardSelected]}
                  >
                    {plan.badge ? (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{plan.badge}</Text>
                      </View>
                    ) : (
                      <View style={styles.badgePlaceholder} />
                    )}
                    <Text style={styles.planDescription}>{plan.description}</Text>
                    <Text style={[styles.planLabel, isSelected && styles.planLabelSelected]}>
                      {plan.label}
                    </Text>
                    <Text style={[styles.planPrice, isSelected && styles.planPriceSelected]}>
                      {plan.price}
                    </Text>
                    <Text style={[styles.planPeriod, isSelected && styles.planPeriodSelected]}>
                      {plan.period}
                    </Text>
                    <View style={[styles.planPerMonth, isSelected && styles.planPerMonthSelected]}>
                      <Text style={[styles.planPerMonthText, isSelected && styles.planPerMonthTextSelected]}>
                        {plan.pricePerMonth}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* CTA Button */}
          <Animated.View style={[styles.ctaWrap, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
              onPress={handlePurchase}
              activeOpacity={0.9}
              disabled={loading}
              testID="cta-button"
            >
              <LinearGradient
                colors={loading ? ['#555', '#444'] : ['#6C63FF', '#4ECDC4']}
                style={styles.ctaButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <Text style={styles.ctaText}>Обработка...</Text>
                ) : (
                  <>
                    <Text style={styles.ctaText}>Попробовать бесплатно</Text>
                    <Text style={styles.ctaSubtext}>7 дней бесплатно, затем {
                      selectedPlan === 'yearly' ? '2 990 ₽/год' : '599 ₽/мес'
                    }</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <Text style={styles.footer}>
            Отмена в любое время · Без скрытых платежей
          </Text>
          <Text style={styles.footerLinks}>
            Условия использования  ·  Политика конфиденциальности
          </Text>
        </ScrollView>
      </SafeAreaView>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#1A1040', '#0D2A1A']}
            style={[styles.modalCard, { borderRadius: 28 }]}
          >
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={styles.modalTitle}>Добро пожаловать{'\n'}в Premium!</Text>
            <Text style={styles.modalDesc}>
              Твоя подписка активирована. Наслаждайся безлимитными медитациями и AI-рекомендациями.
            </Text>
            <TouchableOpacity
              onPress={handleSuccessClose}
              testID="success-button"
            >
              <LinearGradient
                colors={['#6C63FF', '#4ECDC4']}
                style={styles.modalButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.modalButtonText}>Начать практику →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A1A' },
  safe: { flex: 1 },
  scroll: { paddingBottom: 40 },

  // Back button
  backBtn: { paddingHorizontal: 20, paddingVertical: 10 },
  backBtnText: { color: '#A09DB8', fontSize: 15, fontWeight: '500' },

  blob: { position: 'absolute', borderRadius: 999 },
  blob1: { width: 300, height: 300, backgroundColor: 'rgba(108,99,255,0.18)', top: -80, right: -80 },
  blob2: { width: 250, height: 250, backgroundColor: 'rgba(78,205,196,0.12)', bottom: 100, left: -60 },

  // Header
  header: { alignItems: 'center', paddingTop: 24, paddingBottom: 28, paddingHorizontal: 24 },
  crownWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(108,99,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(108,99,255,0.4)',
  },
  crownEmoji: { fontSize: 36 },
  title: { fontSize: 30, fontWeight: '800', color: '#F0EEFF', letterSpacing: -0.5, marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#A09DB8', textAlign: 'center', lineHeight: 24 },

  // Benefits
  benefitsCard: {
    marginHorizontal: 20, borderRadius: 24,
    borderWidth: 1, borderColor: 'rgba(108,99,255,0.2)',
    overflow: 'hidden', marginBottom: 28,
  },
  benefitRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  benefitBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  benefitIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(108,99,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  benefitEmoji: { fontSize: 20 },
  benefitText: { flex: 1 },
  benefitTitle: { fontSize: 14, fontWeight: '700', color: '#F0EEFF', marginBottom: 2 },
  benefitDesc: { fontSize: 12, color: '#A09DB8' },
  checkmark: { fontSize: 16, color: '#4ECDC4', fontWeight: '700' },

  // Plans
  plansTitle: { fontSize: 18, fontWeight: '700', color: '#F0EEFF', marginLeft: 20, marginBottom: 12 },
  plansRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 24 },
  planWrap: { flex: 1, borderRadius: 20, overflow: 'hidden' },
  planCard: {
    padding: 16, borderRadius: 20, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    minHeight: 180,
  },
  planCardSelected: { borderColor: 'transparent' },
  badge: {
    backgroundColor: '#FFD700', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3, marginBottom: 8,
  },
  badgePlaceholder: { height: 22, marginBottom: 8 },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#1A1A1A', letterSpacing: 0.5 },
  planDescription: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4, textAlign: 'center' },
  planLabel: { fontSize: 14, fontWeight: '700', color: '#A09DB8', marginBottom: 8 },
  planLabelSelected: { color: 'rgba(255,255,255,0.9)' },
  planPrice: { fontSize: 26, fontWeight: '800', color: '#F0EEFF', letterSpacing: -0.5 },
  planPriceSelected: { color: '#FFFFFF' },
  planPeriod: { fontSize: 12, color: '#605C7A', marginBottom: 8 },
  planPeriodSelected: { color: 'rgba(255,255,255,0.7)' },
  planPerMonth: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  planPerMonthSelected: { backgroundColor: 'rgba(255,255,255,0.2)' },
  planPerMonthText: { fontSize: 11, color: '#A09DB8', fontWeight: '600' },
  planPerMonthTextSelected: { color: '#FFFFFF' },

  // CTA
  ctaWrap: { marginHorizontal: 20, borderRadius: 18, overflow: 'hidden', marginBottom: 16 },
  ctaButton: { paddingVertical: 18, alignItems: 'center', borderRadius: 18 },
  ctaText: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.3 },
  ctaSubtext: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 },

  // Footer
  footer: { textAlign: 'center', fontSize: 12, color: '#605C7A', marginBottom: 6 },
  footerLinks: { textAlign: 'center', fontSize: 11, color: '#3D3A52' },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  modalCard: { width: '100%', padding: 32, alignItems: 'center' },
  modalEmoji: { fontSize: 64, marginBottom: 16 },
  modalTitle: { fontSize: 26, fontWeight: '800', color: '#F0EEFF', textAlign: 'center', marginBottom: 12, lineHeight: 34 },
  modalDesc: { fontSize: 15, color: '#A09DB8', textAlign: 'center', lineHeight: 24, marginBottom: 28 },
  modalButton: { paddingVertical: 16, paddingHorizontal: 40, borderRadius: 16 },
  modalButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
