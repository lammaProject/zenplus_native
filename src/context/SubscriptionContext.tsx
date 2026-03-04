import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SubscriptionContextType {
  isPremium: boolean;
  activatePremium: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPremium: false,
  activatePremium: () => {},
});

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);

  const activatePremium = () => setIsPremium(true);

  return (
    <SubscriptionContext.Provider value={{ isPremium, activatePremium }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
