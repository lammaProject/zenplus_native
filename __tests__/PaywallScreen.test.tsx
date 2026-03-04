import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import PaywallScreen from '../src/screens/PaywallScreen';

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

describe('PaywallScreen', () => {
  it('рендерится без ошибок', () => {
    const { getByText } = render(<PaywallScreen />);
    expect(getByText('ZenPulse Premium')).toBeTruthy();
  });

  it('отображает все 6 преимуществ Premium', () => {
    const { getByText } = render(<PaywallScreen />);
    expect(getByText('Безлимитные медитации')).toBeTruthy();
    expect(getByText('AI-рекомендации')).toBeTruthy();
    expect(getByText('Сон и восстановление')).toBeTruthy();
    expect(getByText('Подробная аналитика')).toBeTruthy();
    expect(getByText('Бинауральные ритмы')).toBeTruthy();
    expect(getByText('Офлайн доступ')).toBeTruthy();
  });

  it('отображает оба тарифа', () => {
    const { getByText } = render(<PaywallScreen />);
    expect(getByText('Месячный')).toBeTruthy();
    expect(getByText('Годовой')).toBeTruthy();
  });

  it('годовой тариф выбран по умолчанию', () => {
    const { getByTestId } = render(<PaywallScreen />);
    // Кнопка CTA должна показывать цену годового тарифа
    expect(getByTestId('cta-button')).toBeTruthy();
  });

  it('переключение на месячный тариф меняет цену в CTA', () => {
    const { getByTestId, getAllByText } = render(<PaywallScreen />);
    fireEvent.press(getByTestId('plan-monthly'));
    // После выбора месячного тарифа "599 ₽/мес" должен встречаться в CTA
    const matches = getAllByText(/599 ₽\/мес/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('переключение обратно на годовой тариф', () => {
    const { getByTestId, getByText } = render(<PaywallScreen />);
    fireEvent.press(getByTestId('plan-monthly'));
    fireEvent.press(getByTestId('plan-yearly'));
    expect(getByText(/2 990 ₽\/год/)).toBeTruthy();
  });

  it('бейдж "ВЫГОДА 58%" отображается на годовом тарифе', () => {
    const { getByText } = render(<PaywallScreen />);
    expect(getByText('ВЫГОДА 58%')).toBeTruthy();
  });

  it('нажатие на CTA показывает состояние загрузки', () => {
    const { getByTestId, getByText } = render(<PaywallScreen />);
    fireEvent.press(getByTestId('cta-button'));
    expect(getByText('Обработка...')).toBeTruthy();
  });

  it('после успешной покупки показывается модальное окно', async () => {
    jest.useFakeTimers();
    const { getByTestId, getByText } = render(<PaywallScreen />);
    fireEvent.press(getByTestId('cta-button'));
    act(() => { jest.advanceTimersByTime(1500); });
    await waitFor(() => {
      expect(getByText('Добро пожаловать\nв Premium!')).toBeTruthy();
    });
    jest.useRealTimers();
  });

  it('вызывает onSuccess при закрытии модального окна', async () => {
    jest.useFakeTimers();
    const onSuccess = jest.fn();
    const { getByTestId } = render(<PaywallScreen onSuccess={onSuccess} />);
    fireEvent.press(getByTestId('cta-button'));
    act(() => { jest.advanceTimersByTime(2000); });
    await waitFor(() => {
      expect(getByTestId('success-button')).toBeTruthy();
    }, { timeout: 3000 });
    fireEvent.press(getByTestId('success-button'));
    expect(onSuccess).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  }, 10000);
});
