import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  CalendarDays,
  ChevronRight,
  LogOut,
  Mail,
  MapPin,
  Settings,
  User,
} from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../../context/useContext";
import { Card } from "../components/ui/card";
import { apiRequest } from "../lib/queryClient";

export default function Profile() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { user: currentUser, logout, isLoading: authLoading } = useAuth();

  // 1. Lógica de ID Robusta: Buscamos en todas las fuentes posibles
  const userId = route.params?.id || currentUser?.id || currentUser?.idUsuario;

  // 2. Consulta con React Query
  const {
    data: profileData,
    isLoading: queryLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      // Si llegamos aquí y es undefined, lanzamos error para evitar el 400 del servidor
      if (!userId || userId === "undefined") throw new Error("ID no válido");

      console.log(`📡 Solicitando datos para el ID: ${userId}`);
      const res = await apiRequest("GET", `/usuarios/${userId}`);

      if (!res.ok) throw new Error("Error al obtener perfil");
      const data = await res.json();

      // Según tu log, el objeto puede venir dentro de 'user' o directo
      return data.user || data;
    },
    // CLAVE: Solo se activa si el Auth terminó y tenemos un ID real
    enabled: !authLoading && !!userId && userId !== "undefined",
  });

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Deseas salir de EcoResiduos?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", style: "destructive", onPress: logout },
    ]);
  };

  // Estado de carga inicial (Mientras AuthContext despierta)
  if (authLoading || (queryLoading && !!userId)) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1f5c2e" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  // Estado si no hay ID (Usuario no logueado o sesión rota)
  if (!userId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se pudo identificar al usuario.</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header con diseño circular */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <User size={50} color="#fff" />
        </View>
        <Text style={styles.userName}>{profileData?.nombre || "Usuario"}</Text>
        <View style={styles.badge}>
          <Text style={styles.userRole}>
            {profileData?.rol?.toUpperCase() || "USUARIO"}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Card de Puntos */}
        <Card style={styles.pointsCard}>
          <View style={styles.pointsInfo}>
            <Award size={30} color="#1f5c2e" />
            <View>
              <Text style={styles.pointsLabel}>Puntos Acumulados</Text>
              <Text style={styles.pointsValue}>
                {profileData?.puntosAcumulados ?? 0} pts
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Canjear</Text>
          </TouchableOpacity>
        </Card>

        {/* Información Detallada */}
        <Text style={styles.sectionTitle}>Datos de contacto</Text>
        <Card style={styles.infoCard}>
          <InfoItem
            icon={Mail}
            label="Correo Electrónico"
            value={profileData?.email}
          />
          <Divider />
          <InfoItem
            icon={MapPin}
            label="Dirección de Retiro"
            value={profileData?.direccion || "Sin dirección registrada"}
          />
          <Divider />
          <InfoItem
            icon={CalendarDays}
            label="Fecha de Registro"
            value={new Date(profileData?.fechaRegistro).toLocaleDateString()}
          />
        </Card>

        {/* Opciones */}
        <Text style={styles.sectionTitle}>Ajustes</Text>
        <TouchableOpacity style={styles.optionRow}>
          <Settings size={20} color="#4b5563" />
          <Text style={styles.optionText}>Configurar cuenta</Text>
          <ChevronRight size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionRow, styles.logoutRow]}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#ef4444" />
          <Text style={[styles.optionText, { color: "#ef4444" }]}>
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Sub-componentes para organización
const InfoItem = ({ icon: Icon, label, value }: any) => (
  <View style={styles.infoRow}>
    <Icon size={20} color="#1f5c2e" />
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdfbf7" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#1f5c2e" },
  header: {
    backgroundColor: "#1f5c2e",
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  userName: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  badge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  userRole: { fontSize: 12, color: "#fff", fontWeight: "600" },
  content: { padding: 20 },
  pointsCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginTop: -40,
    elevation: 4,
  },
  pointsInfo: { flexDirection: "row", alignItems: "center", gap: 15 },
  pointsLabel: { fontSize: 12, color: "#6b7280" },
  pointsValue: { fontSize: 22, fontWeight: "bold", color: "#1f5c2e" },
  actionButton: { backgroundColor: "#1f5c2e", padding: 10, borderRadius: 12 },
  actionText: { color: "#fff", fontWeight: "bold" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 25,
    marginBottom: 10,
  },
  infoCard: { padding: 15 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 10,
  },
  infoTextContainer: { flex: 1 },
  infoLabel: { fontSize: 11, color: "#9ca3af", textTransform: "uppercase" },
  infoValue: { fontSize: 15, color: "#1f2937", fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#f3f4f6", marginVertical: 5 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginTop: 10,
    gap: 15,
  },
  optionText: { flex: 1, fontWeight: "500", color: "#374151" },
  logoutRow: { marginTop: 20, borderTopWidth: 0 },
  errorText: { color: "#ef4444", marginBottom: 20 },
  retryButton: { backgroundColor: "#1f5c2e", padding: 10, borderRadius: 10 },
  retryText: { color: "#fff" },
});
