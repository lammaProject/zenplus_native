import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SubscriptionProvider, useSubscription } from './src/context/SubscriptionContext';
import MeditationsScreen from './src/screens/MeditationsScreen';
import PaywallScreen from './src/screens/PaywallScreen';
import AIMoodScreen from './src/screens/AIMoodScreen';

type Screen = 'meditations' | 'paywall' | 'ai-mood';

function AppNavigator() {
  const [screen, setScreen] = useState<Screen>('meditations');
  const { activatePremium } = useSubscription();

  const handlePurchaseSuccess = () => {
    activatePremium();
    setScreen('meditations');
  };

  if (screen === 'paywall') {
    return (
      <PaywallScreen
        onSuccess={handlePurchaseSuccess}
        onBack={() => setScreen('meditations')}
      />
    );
  }

  if (screen === 'ai-mood') {
    return <AIMoodScreen onBack={() => setScreen('meditations')} />;
  }

  return (
    <MeditationsScreen
      onOpenPaywall={() => setScreen('paywall')}
      onOpenAIMood={() => setScreen('ai-mood')}
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
