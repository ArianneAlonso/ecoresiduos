import { View, StyleSheet } from 'react-native';
import QuickActionCard from '../QuickActionCard';
import { Truck } from 'lucide-react-native';

export default function QuickActionCardExample() {
  return (
    <View style={styles.container}>
      <QuickActionCard
        icon={Truck}
        title="Solicitar Retiro"
        description="Programa la recolección de tus residuos"
        onPress={() => console.log('Solicitar retiro clicked')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
