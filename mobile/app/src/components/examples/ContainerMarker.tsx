import { View, StyleSheet } from 'react-native';
import ContainerMarker from '../ContainerMarker';

export default function ContainerMarkerExample() {
  return (
    <View style={styles.container}>
      <ContainerMarker
        type="Contenedor Verde"
        address="Av. Principal 123"
        materials={["Plástico", "Vidrio", "Papel"]}
        distance="0.5 km de tu ubicación"
        schedule="Lun - Vie: 7:00 AM - 6:00 PM"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
