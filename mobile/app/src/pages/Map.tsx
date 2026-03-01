import { useQuery } from "@tanstack/react-query";
import { Filter, Search } from "lucide-react-native";
import React, { useState } from "react"; // Importación vital agregada
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

// Importaciones de tus componentes locales
import AppHeader from "../../src/components/AppHeader";
import ContainerMarker from "../../src/components/ContainerMarker";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { apiRequest } from "../lib/queryClient";

export default function Map() {
  const [search, setSearch] = useState("");

  // LLAMADA REAL A LA API
  const { data: rawData, isLoading } = useQuery({
    queryKey: ["contenedores"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/contenedores");
      const json = await res.json();

      // AQUÍ ESTÁ EL CAMBIO: Accedemos a json.contenedores
      // Si json.contenedores no existe, devolvemos un array vacío []
      return json.contenedores || [];
    },
  });

  const contenedores = Array.isArray(rawData) ? rawData : [];

  const filteredContainers = contenedores.filter(
    (c: any) =>
      c.nombre_identificador?.toLowerCase().includes(search.toLowerCase()) ||
      c.materiales_aceptados?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title="Mapa de Contenedores"
        action={
          <Button size="icon" variant="ghost">
            <Filter size={20} color="#6b7280" />
          </Button>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchSection}>
          <View style={styles.searchInputWrapper}>
            <Search size={20} color="#6b7280" style={styles.searchIcon} />
            <Input
              placeholder="Buscar plástico, vidrio o dirección..."
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>
        </View>

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -26.1775, // Centro de Formosa
            longitude: -58.1781,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {filteredContainers?.map((c: any) => (
            <Marker
              key={c.idContenedor}
              coordinate={{
                // Aseguramos que sean números, ya que de la DB vienen a veces como strings
                latitude: parseFloat(c.latitud),
                longitude: parseFloat(c.longitud),
              }}
              title={c.nombreIdentificador}
              description={c.direccion}
            />
          ))}
        </MapView>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>
            Puntos de Reciclaje en Formosa
          </Text>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#1f5c2e"
              style={{ marginTop: 20 }}
            />
          ) : (
            <View style={styles.containersList}>
              {filteredContainers?.map((c: any) => (
                <ContainerMarker
                  key={c.idContenedor}
                  type={c.nombreIdentificador}
                  address={c.direccion}
                  // Convertimos el string de la DB "Plástico, Vidrio" en array para el componente
                  materials={
                    c.materialesAceptados
                      ? c.materialesAceptados.split(", ")
                      : []
                  }
                  distance="Cerca de ti"
                  schedule={c.horarios || "Consultar horarios"}
                />
              ))}

              {filteredContainers?.length === 0 && !isLoading && (
                <Text style={styles.emptyText}>
                  No se encontraron contenedores.
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, padding: 16, paddingBottom: 100 },
  searchSection: { marginTop: 8, marginBottom: 16 },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 45, backgroundColor: "transparent" },
  map: { height: 250, borderRadius: 16, overflow: "hidden", marginBottom: 20 },
  listSection: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  containersList: { gap: 12 },
  emptyText: { textAlign: "center", color: "#6b7280", marginTop: 20 },
});
