export type Category = 'all' | 'morning' | 'focus' | 'sleep' | 'anxiety' | 'breathwork' | 'energy';

export interface Session {
  id: string;
  title: string;
  subtitle: string;
  duration: number; // minutes
  category: Category;
  emoji: string;
  gradient: readonly [string, string];
  isPremium: boolean;
  rating: number;
  plays: number;
}

export const SESSIONS: Session[] = [
  {
    id: '1',
    title: 'Утренняя ясность',
    subtitle: 'Начни день с намерением',
    duration: 5,
    category: 'morning',
    emoji: '🌅',
    gradient: ['#FF6B35', '#F7C59F'],
    isPremium: false,
    rating: 4.9,
    plays: 12420,
  },
  {
    id: '2',
    title: 'Глубокий фокус',
    subtitle: 'Активация потокового состояния',
    duration: 15,
    category: 'focus',
    emoji: '🎯',
    gradient: ['#6C63FF', '#9D97FF'],
    isPremium: false,
    rating: 4.8,
    plays: 8930,
  },
  {
    id: '3',
    title: 'Снятие тревоги',
    subtitle: 'Успокой внутренний шторм',
    duration: 10,
    category: 'anxiety',
    emoji: '🌊',
    gradient: ['#4ECDC4', '#44A08D'],
    isPremium: false,
    rating: 4.9,
    plays: 21500,
  },
  {
    id: '4',
    title: 'Ночное убежище',
    subtitle: 'Погружение в глубокий сон',
    duration: 20,
    category: 'sleep',
    emoji: '🌙',
    gradient: ['#1A1A3E', '#4A4A8A'],
    isPremium: true,
    rating: 4.7,
    plays: 15670,
  },
  {
    id: '5',
    title: 'Дыхание 4-7-8',
    subtitle: 'Древняя техника дыхания',
    duration: 5,
    category: 'breathwork',
    emoji: '💨',
    gradient: ['#A8EDEA', '#4ECDC4'],
    isPremium: false,
    rating: 4.8,
    plays: 9800,
  },
  {
    id: '6',
    title: 'Заряд энергии',
    subtitle: 'Активируй свою vitality',
    duration: 7,
    category: 'energy',
    emoji: '⚡',
    gradient: ['#F7971E', '#FFD200'],
    isPremium: true,
    rating: 4.6,
    plays: 5430,
  },
  {
    id: '7',
    title: 'Сканирование тела',
    subtitle: 'Освободи накопленное напряжение',
    duration: 12,
    category: 'anxiety',
    emoji: '✨',
    gradient: ['#DA4453', '#89216B'],
    isPremium: true,
    rating: 4.7,
    plays: 7890,
  },
  {
    id: '8',
    title: 'Коробочное дыхание',
    subtitle: 'Техника ВМФ США',
    duration: 5,
    category: 'breathwork',
    emoji: '🔲',
    gradient: ['#0F2027', '#203A43'],
    isPremium: true,
    rating: 4.8,
    plays: 11200,
  },
  {
    id: '9',
    title: 'Благодарность',
    subtitle: 'Практика признательности',
    duration: 8,
    category: 'morning',
    emoji: '🙏',
    gradient: ['#F093FB', '#F5576C'],
    isPremium: true,
    rating: 4.9,
    plays: 6700,
  },
  {
    id: '10',
    title: 'Визуализация',
    subtitle: 'Создай свою реальность',
    duration: 10,
    category: 'focus',
    emoji: '🔮',
    gradient: ['#4776E6', '#8E54E9'],
    isPremium: true,
    rating: 4.7,
    plays: 4320,
  },
];

export const CATEGORIES: { id: Category | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: 'Все', emoji: '✨' },
  { id: 'morning', label: 'Утро', emoji: '🌅' },
  { id: 'focus', label: 'Фокус', emoji: '🎯' },
  { id: 'anxiety', label: 'Тревога', emoji: '🌊' },
  { id: 'sleep', label: 'Сон', emoji: '🌙' },
  { id: 'breathwork', label: 'Дыхание', emoji: '💨' },
  { id: 'energy', label: 'Энергия', emoji: '⚡' },
];
