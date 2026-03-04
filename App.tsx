import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider, YStack, Text, Button } from 'tamagui';
import tamaguiConfig from './tamagui.config';

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Text fontSize="$8" fontWeight="bold" color="$color">
          ZenPulse 🧘
        </Text>
        <Text fontSize="$4" color="$colorSubtle" marginTop="$2">
          Tamagui is working!
        </Text>
        <Button marginTop="$4" theme="active">
          Get Started
        </Button>
      </YStack>
      <StatusBar style="auto" />
    </TamaguiProvider>
  );
}
