import { StatusBar } from 'expo-status-bar';
import PaywallScreen from './src/screens/PaywallScreen';

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <PaywallScreen onSuccess={() => console.log('Purchase success!')} />
    </>
  );
}
