import { View, StyleSheet } from 'react-native';
import UpcomingCollection from '../UpcomingCollection';

export default function UpcomingCollectionExample() {
  return (
    <View style={styles.container}>
      <UpcomingCollection
        date="Viernes, 1 de Noviembre"
        time="8:00 AM - 12:00 PM"
        materials={["Plástico", "Vidrio", "Papel"]}
        daysUntil={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
