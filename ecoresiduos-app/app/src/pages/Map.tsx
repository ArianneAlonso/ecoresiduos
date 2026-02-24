import { MapPin, Search, Filter } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';
import AppHeader from '../../src/components/AppHeader';
import ContainerMarker from '../../src/components/ContainerMarker';
import { Input } from '../../src/components/ui/input';
import { Button } from '../../src/components/ui/button';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const containers = [
  {
    id: "1",
    type: "Contenedor Verde",
    address: "Av. Principal 123",
    materials: ["Plástico", "Vidrio", "Papel"],
    distance: "0.5 km",
    schedule: "Lun - Vie: 7:00 AM - 6:00 PM",
    latitude: -26.1775,
    longitude: -58.1781,
  },
  {
    id: "2",
    type: "Punto Ecológico",
    address: "Plaza Central",
    materials: ["Electrónicos", "Baterías"],
    distance: "1.2 km",
    schedule: "Mar y Jue: 9:00 AM - 5:00 PM",
    latitude: -26.1800,
    longitude: -58.1750,
  },
  {
    id: "3",
    type: "Contenedor Azul",
    address: "Calle Secundaria 456",
    materials: ["Papel", "Cartón"],
    distance: "0.8 km",
    schedule: "Lun - Sáb: 8:00 AM - 8:00 PM",
    latitude: -26.1750,
    longitude: -58.1800,
  },
];

export default function Map() {
  return (
    <View style={styles.container}>
      <AppHeader 
        title="Mapa de Contenedores"
        action={
          <Button size="icon" variant="ghost" testID="button-filter">
            <Filter size={20} color="#6b7280" />
          </Button>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchSection}>
          <View style={styles.searchInputWrapper}>
            <Search size={20} color="#6b7280" style={styles.searchIcon} />
            <Input
              placeholder="Buscar por dirección..."
              style={styles.searchInput}
              testID="input-search"
            />
          </View>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContainer}
        >
          <TouchableOpacity style={styles.filterBadgeActive}>
            <Text style={styles.filterTextActive}>Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBadge}>
            <Text style={styles.filterText}>Plástico</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBadge}>
            <Text style={styles.filterText}>Vidrio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBadge}>
            <Text style={styles.filterText}>Papel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBadge}>
            <Text style={styles.filterText}>Electrónicos</Text>
          </TouchableOpacity>
        </ScrollView>

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
          <Text style={styles.sectionTitle}>Contenedores Cercanos</Text>
          <View style={styles.containersList}>
            {containers.map((container) => (
              <ContainerMarker 
                key={container.id} 
                type={container.type}
                address={container.address}
                materials={container.materials}
                distance={container.distance}
                schedule={container.schedule}
              />
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
  filtersScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filtersContainer: {
    gap: 8,
  },
  filterBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
  },
  filterBadgeActive: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1f5c2e',
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
  },
  filterTextActive: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
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
    color: '#111827',
    marginBottom: 12,
  },
  containersList: {
    gap: 12,
  },
});