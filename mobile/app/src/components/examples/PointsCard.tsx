import { View, StyleSheet } from 'react-native';
import PointsCard from '../PointsCard';

export default function PointsCardExample() {
  return (
    <View style={styles.container}>
      <PointsCard points={1250} change={85} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
