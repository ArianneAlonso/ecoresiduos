import { View, StyleSheet } from 'react-native';
import RewardCard from '../RewardCard';

export default function RewardCardExample() {
  return (
    <View style={styles.container}>
      <RewardCard
        title="20% de descuento"
        description="En tu próxima compra"
        pointsRequired={500}
        merchant="EcoTienda Verde"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
