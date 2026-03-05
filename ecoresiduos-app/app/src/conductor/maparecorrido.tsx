import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';

export default function MapaRecorrido() {
  const mapRef = useRef<MapView>(null);

  const puntosRuta = [
    { latitude: -26.184, longitude: -58.173 },
    { latitude: -26.185, longitude: -58.174 },
    { latitude: -26.186, longitude: -58.175 },
    { latitude: -26.187, longitude: -58.176 },
  ];

  const [posicionActual, setPosicionActual] = useState(puntosRuta[0]);
  const [indice, setIndice] = useState(0);
  const [recorridos, setRecorridos] = useState([
    { id: 1, lat: -26.185, lng: -58.174, estado: 'pendiente' },
    { id: 2, lat: -26.186, lng: -58.175, estado: 'pendiente' },
  ]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice((prev) => {
        if (prev < puntosRuta.length - 1) {
          const nuevoIndice = prev + 1;
          const nuevaPosicion = puntosRuta[nuevoIndice];
          setPosicionActual(nuevaPosicion);

          mapRef.current?.animateToRegion({
            ...nuevaPosicion,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });

          setRecorridos((prevRecorridos) =>
            prevRecorridos.map((casa) => {
              const distancia =
                Math.abs(casa.lat - nuevaPosicion.latitude) +
                Math.abs(casa.lng - nuevaPosicion.longitude);

              if (distancia < 0.002) {
                return { ...casa, estado: 'completado' };
              }

              return casa;
            })
          );

          return nuevoIndice;
        } else {
          clearInterval(intervalo);
          return prev;
        }
      });
    }, 2000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Recorrido del Día</Text>

        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: -26.184,
            longitude: -58.173,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Polyline
            coordinates={puntosRuta}
            strokeColor="#4caf50"
            strokeWidth={4}
          />

          <Marker
            coordinate={posicionActual}
            title="Camión"
            pinColor="blue"
          />

          {recorridos.map((casa) => (
            <Marker
              key={casa.id}
              coordinate={{
                latitude: casa.lat,
                longitude: casa.lng,
              }}
              pinColor={casa.estado === 'completado' ? 'green' : 'red'}
            />
          ))}
        </MapView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#4caf50',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  map: {
    flex: 1,
    borderRadius: 20,
  },
});