import { View, StyleSheet } from 'react-native';
import EventCard from '../EventCard';

export default function EventCardExample() {
  return (
    <View style={styles.container}>
      <EventCard
        title="Jornada de Limpieza"
        date="Sábado, 5 de Noviembre - 9:00 AM"
        location="Plaza Central"
        description="Únete a nuestra jornada de limpieza comunitaria y gana puntos extra"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
