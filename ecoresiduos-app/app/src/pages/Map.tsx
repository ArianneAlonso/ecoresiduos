import { useState } from 'react';
import { MapPin, Search, Filter } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';
import AppHeader from '../../src/components/AppHeader';
import ContainerMarker from '../../src/components/ContainerMarker';
import { Input } from '../../src/components/ui/input';
import { Button } from '../../src/components/ui/button';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const containers = [
  {
    id: "2",
    type: "Punto Ecológico",
    address: "Plaza San Martín",
    materials: ["Carton", "Plasticos"],
    schedule: "Mar y Jue: 9:00 AM - 5:00 PM",
    latitude: -26.1852983,
    longitude: -58.1744976,
  },
];

export default function Map() {
  const [attending, setAttending] = useState({});

  const toggleAttendance = (id) => {
    setAttending((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={styles.container}>
      <AppHeader 
        title=""
        action={
          <Button size="icon" variant="ghost" testID="button-filter">
            <Filter size={20} color="#4caf50" />
          </Button>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchSection}>
          <View style={styles.searchInputWrapper}>
          </View>
        </View>

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -26.1775,
            longitude: -58.1781,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          {containers.map((container) => (
            <Marker
              key={container.id}
              coordinate={{
                latitude: container.latitude,
                longitude: container.longitude,
              }}
              title={container.type}
              description={container.address}
            />
          ))}
        </MapView>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Eventos Ecopuntos</Text>
          <View style={styles.containersList}>
            {containers.map((container) => (
              <View key={container.id}>
                <ContainerMarker 
                  type={container.type}
                  address={container.address}
                  materials={container.materials}
                  distance={container.distance}
                  schedule={container.schedule}
                />
                <Button
                  style={[
                    styles.attendButton,
                    attending[container.id] && styles.cancelButton
                  ]}
                  onPress={() => toggleAttendance(container.id)}
                >
                  <Text style={styles.attendButtonText}>
                    {attending[container.id]
                      ? "Cancelar asistencia"
                      : "Confirmar asistencia"}
                  </Text>
                </Button>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
    paddingBottom: 100,
  },
  searchSection: {
    marginTop: 8,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginLeft: 12,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 0,
  },
  map: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  listSection: {},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4caf50',
    marginBottom: 12,
  },
  containersList: {
    gap: 12,
  },
  attendButton: {
    marginTop: 10,
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#4caf50',
  },
  cancelButton: {
    backgroundColor: '#c62828',
  },
  attendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});