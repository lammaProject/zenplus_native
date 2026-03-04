import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SubscriptionProvider, useSubscription } from './src/context/SubscriptionContext';
import MeditationsScreen from './src/screens/MeditationsScreen';
import PaywallScreen from './src/screens/PaywallScreen';

type Screen = 'meditations' | 'paywall';

function AppNavigator() {
  const [screen, setScreen] = useState<Screen>('meditations');
  const { activatePremium } = useSubscription();

  const handleSuccess = () => {
    activatePremium();
    setScreen('meditations');
  };

  if (screen === 'paywall') {
    return (
      <PaywallScreen
        onSuccess={handleSuccess}
        onBack={() => setScreen('meditations')}
      />
    );
  }

  return (
    <MeditationsScreen
      onOpenPaywall={() => setScreen('paywall')}
    />
  );
}

export default function App() {
  return (
    <SubscriptionProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SubscriptionProvider>
  );
}
