import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MeditationsScreen from '../src/screens/MeditationsScreen';
import { SubscriptionProvider } from '../src/context/SubscriptionContext';
import { SESSIONS, CATEGORIES } from '../src/data/sessions';

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return { LinearGradient: View };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

function renderWithProvider(
  onOpenPaywall = jest.fn(),
  onOpenAIMood = jest.fn(),
) {
  return render(
    <SubscriptionProvider>
      <MeditationsScreen onOpenPaywall={onOpenPaywall} onOpenAIMood={onOpenAIMood} />
    </SubscriptionProvider>
  );
}

describe('MeditationsScreen', () => {
  it('рендерится без ошибок', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Медитации')).toBeTruthy();
  });

  it('отображает приветствие', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Добро пожаловать 👋')).toBeTruthy();
  });

  it('показывает кнопку "Разблокировать" для free пользователей', () => {
    const { getByTestId } = renderWithProvider();
    expect(getByTestId('unlock-button')).toBeTruthy();
  });

  it('отображает все категории', () => {
    const { getByTestId } = renderWithProvider();
    CATEGORIES.forEach(cat => {
      expect(getByTestId(`category-${cat.id}`)).toBeTruthy();
    });
  });

  it('отображает stats bar для free пользователей', () => {
    const { getByTestId } = renderWithProvider();
    expect(getByTestId('stats-bar')).toBeTruthy();
  });

  it('отображает карточки всех сессий', () => {
    const { getByTestId } = renderWithProvider();
    SESSIONS.forEach(session => {
      expect(getByTestId(`session-card-${session.id}`)).toBeTruthy();
    });
  });

  it('premium сессии показывают lock overlay и premium badge', () => {
    const { getByTestId } = renderWithProvider();
    const premiumSessions = SESSIONS.filter(s => s.isPremium);
    premiumSessions.forEach(session => {
      expect(getByTestId(`lock-overlay-${session.id}`)).toBeTruthy();
      expect(getByTestId(`premium-badge-${session.id}`)).toBeTruthy();
    });
  });

  it('нажатие на locked сессию вызывает onOpenPaywall', () => {
    const onOpenPaywall = jest.fn();
    const { getByTestId } = renderWithProvider(onOpenPaywall);
    const premiumSession = SESSIONS.find(s => s.isPremium)!;
    fireEvent.press(getByTestId(`session-card-${premiumSession.id}`));
    expect(onOpenPaywall).toHaveBeenCalledTimes(1);
  });

  it('нажатие на кнопку "Разблокировать" вызывает onOpenPaywall', () => {
    const onOpenPaywall = jest.fn();
    const { getByTestId } = renderWithProvider(onOpenPaywall);
    fireEvent.press(getByTestId('unlock-button'));
    expect(onOpenPaywall).toHaveBeenCalledTimes(1);
  });

  it('фильтрация по категории "Утро" показывает только утренние сессии', () => {
    const { getByTestId, queryByTestId } = renderWithProvider();
    fireEvent.press(getByTestId('category-morning'));
    const morningSessions = SESSIONS.filter(s => s.category === 'morning');
    const otherSessions = SESSIONS.filter(s => s.category !== 'morning');
    morningSessions.forEach(s => {
      expect(getByTestId(`session-card-${s.id}`)).toBeTruthy();
    });
    otherSessions.forEach(s => {
      expect(queryByTestId(`session-card-${s.id}`)).toBeNull();
    });
  });

  it('фильтрация по "Все" показывает все сессии', () => {
    const { getByTestId } = renderWithProvider();
    // Click "morning" first, then back to "all"
    fireEvent.press(getByTestId('category-morning'));
    fireEvent.press(getByTestId('category-all'));
    SESSIONS.forEach(s => {
      expect(getByTestId(`session-card-${s.id}`)).toBeTruthy();
    });
  });

  it('нажатие на free сессию не вызывает onOpenPaywall', () => {
    const onOpenPaywall = jest.fn();
    const { getByTestId } = renderWithProvider(onOpenPaywall);
    const freeSession = SESSIONS.find(s => !s.isPremium)!;
    fireEvent.press(getByTestId(`session-card-${freeSession.id}`));
    expect(onOpenPaywall).not.toHaveBeenCalled();
  });
});
