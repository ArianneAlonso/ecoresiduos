import { View, StyleSheet } from 'react-native';
import QuantitySelector from '../QuantitySelector';
import { useState } from 'react';

export default function QuantitySelectorExample() {
  const [quantity, setQuantity] = useState(1);
  
  return (
    <View style={styles.container}>
      <QuantitySelector
        value={quantity}
        onChange={setQuantity}
        label="Bolsas de residuos"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
