import { View, StyleSheet } from 'react-native';
import MaterialCard from '../MaterialCard';
import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';

export default function MaterialCardExample() {
  const [selected, setSelected] = useState(false);
  
  return (
    <View style={styles.container}>
      <View style={styles.cardRow}>
        <View style={styles.cardContainer}>
          <MaterialCard
            icon={Trash2}
            label="Plástico"
            selected={selected}
            onPress={() => setSelected(!selected)}
          />
        </View>
        <View style={styles.cardContainer}>
          <MaterialCard
            icon={Trash2}
            label="Vidrio"
            selected={false}
            onPress={() => console.log('Clicked')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cardContainer: {
    flex: 1,
  },
});
