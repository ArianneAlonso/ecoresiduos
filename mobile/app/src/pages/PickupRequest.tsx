import * as Location from "expo-location";
import {
  Cpu,
  FileText,
  Leaf,
  MapPin,
  Package,
  Trash2,
  Wine,
} from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppHeader from "../../src/components/AppHeader";
import MaterialCard from "../../src/components/MaterialCard";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { Label } from "../../src/components/ui/label";
import { apiRequest } from "../lib/queryClient";

const materials = [
  { id: "plastic", icon: Trash2, label: "Plástico" },
  { id: "glass", icon: Wine, label: "Vidrio" },
  { id: "paper", icon: FileText, label: "Papel" },
  { id: "metal", icon: Package, label: "Metal" },
  { id: "electronics", icon: Cpu, label: "Electrónicos" },
  { id: "organic", icon: Leaf, label: "Orgánicos" },
];

const containerTypes = [
  { id: "bolsa-supermercado", label: "Bolsa de supermercado" },
  { id: "bolsa-consorcio", label: "Bolsa de consorcio" },
  { id: "caja-mediana", label: "Caja mediana" },
  { id: "bidon-grande", label: "Bidón grande" },
  { id: "sueltos", label: "Residuos sueltos" },
];

const scheduleOptions = [
  { id: "lunes-mañana", day: "Lunes", time: "Mañana", hours: "8:00 - 12:00" },
  { id: "martes-tarde", day: "Martes", time: "Tarde", hours: "14:00 - 18:00" },
  {
    id: "miercoles-mañana",
    day: "Miércoles",
    time: "Mañana",
    hours: "8:00 - 12:00",
  },
  { id: "jueves-tarde", day: "Jueves", time: "Tarde", hours: "14:00 - 18:00" },
];

export default function PickupRequest() {
  const [step, setStep] = useState(1);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedContainer, setSelectedContainer] = useState("");
  const [address, setAddress] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  // --- OBTENER UBICACIÓN ---
  const handleGetLocation = async () => {
    setIsLoadingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Necesitamos acceso al GPS.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCoords({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });

      let reverse = await Location.reverseGeocodeAsync(location.coords);
      if (reverse.length > 0) {
        const item = reverse[0];
        setAddress(
          `${item.street || ""} ${item.name || ""}, ${item.city || ""}`.trim(),
        );
      }
    } catch (err) {
      Alert.alert("Error", "No se pudo obtener la ubicación.");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const toggleMaterial = (id: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  // --- ENVÍO AL BACKEND (Sincronizado con EntregasController) ---
  const handleSubmit = async () => {
    if (!address || !selectedSchedule) {
      Alert.alert("Faltan datos", "Dirección y horario son obligatorios.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Mapeamos los IDs a etiquetas legibles (ej: "plastic" -> "Plástico")
      const materialLabels = selectedMaterials.map(
        (id) => materials.find((m) => m.id === id)?.label || id,
      );

      const payload = {
        materiales: materialLabels, // Array de strings
        tipoEnvase: selectedContainer, // String
        direccion: address, // String
        horarioPreferencia: selectedSchedule, // String (Match con el backend)
        latitud: coords?.lat || null,
        longitud: coords?.lng || null,
      };

      const response = await apiRequest("POST", "/entregas", payload);
      const result = await response.json();

      if (response.ok) {
        Alert.alert("¡Éxito!", result.message);
        // Reset completo
        setStep(1);
        setSelectedMaterials([]);
        setSelectedContainer("");
        setAddress("");
        setSelectedSchedule("");
      } else {
        Alert.alert(
          "Error 400",
          result.message || "Verifica los datos enviados.",
        );
      }
    } catch (error) {
      Alert.alert("Error", "No hay conexión con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Solicitar Retiro" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Barra de Progreso */}
        <View style={styles.progressBar}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.progressStep,
                s <= step && styles.progressStepActive,
              ]}
            />
          ))}
        </View>

        {/* PASO 1: MATERIALES */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>¿Qué vamos a reciclar?</Text>
            <View style={styles.materialsGrid}>
              {materials.map((m) => (
                <MaterialCard
                  key={m.id}
                  icon={m.icon}
                  label={m.label}
                  selected={selectedMaterials.includes(m.id)}
                  onPress={() => toggleMaterial(m.id)}
                />
              ))}
            </View>
          </View>
        )}

        {/* PASO 2: ENVASE */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Tipo de envase</Text>
            {containerTypes.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.containerCard,
                  selectedContainer === c.id && styles.containerCardSelected,
                ]}
                onPress={() => setSelectedContainer(c.id)}
              >
                <View style={styles.radioCircle}>
                  {selectedContainer === c.id && (
                    <View style={styles.radioDot} />
                  )}
                </View>
                <Text style={styles.containerLabel}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* PASO 3: DETALLES FINALES */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Confirmar entrega</Text>

            <TouchableOpacity
              style={styles.mapButton}
              onPress={handleGetLocation}
            >
              {isLoadingLocation ? (
                <ActivityIndicator color="#1f5c2e" />
              ) : (
                <MapPin color="#6b7280" />
              )}
              <Text style={styles.mapText}>
                {address ? "Ubicación fijada" : "Detectar mi ubicación"}
              </Text>
            </TouchableOpacity>

            <Label>Dirección exacta</Label>
            <Input
              value={address}
              onChangeText={setAddress}
              placeholder="Calle y número"
            />

            <Label style={{ marginTop: 15 }}>Horario de preferencia</Label>
            <View style={styles.scheduleGrid}>
              {scheduleOptions.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[
                    styles.scheduleCard,
                    selectedSchedule === s.id && styles.scheduleCardSelected,
                  ]}
                  onPress={() => setSelectedSchedule(s.id)}
                >
                  <Text style={styles.scheduleDay}>{s.day}</Text>
                  <Text style={styles.scheduleTime}>{s.hours}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* ACCIONES INFERIORES */}
      <View style={styles.footer}>
        {step > 1 && (
          <Button
            variant="outline"
            onPress={() => setStep(step - 1)}
            style={styles.btnHalf}
          >
            Atrás
          </Button>
        )}
        <Button
          onPress={step === 3 ? handleSubmit : () => setStep(step + 1)}
          style={step === 1 ? styles.btnFull : styles.btnHalf}
          disabled={
            isSubmitting || (step === 1 && selectedMaterials.length === 0)
          }
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : step === 3 ? (
            "Confirmar"
          ) : (
            "Siguiente"
          )}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20, paddingBottom: 100 },
  progressBar: { flexDirection: "row", gap: 8, marginBottom: 25 },
  progressStep: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#f3f4f6",
  },
  progressStepActive: { backgroundColor: "#1f5c2e" },
  stepContainer: { gap: 15 },
  stepTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  materialsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  containerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginBottom: 8,
  },
  containerCardSelected: { borderColor: "#1f5c2e", backgroundColor: "#f0fdf4" },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1f5c2e",
  },
  containerLabel: { fontSize: 16, fontWeight: "500" },
  mapButton: {
    height: 60,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  mapText: { color: "#4b5563", fontWeight: "600" },
  scheduleGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  scheduleCard: {
    width: "48%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
  },
  scheduleCardSelected: { borderColor: "#1f5c2e", backgroundColor: "#f0fdf4" },
  scheduleDay: { fontWeight: "bold", fontSize: 14 },
  scheduleTime: { fontSize: 12, color: "#6b7280" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  btnHalf: { flex: 1 },
  btnFull: { width: "100%" },
});
