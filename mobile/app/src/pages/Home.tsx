import { useNavigation } from "@react-navigation/native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  CalendarCheck,
  ChevronRight,
  LogOut,
  MapPin,
  Recycle,
  PlusCircle,
} from "lucide-react-native";
import React from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useAuth } from "../../context/useContext";
import { Card } from "../components/ui/card";
import { apiRequest } from "../lib/queryClient";

export default function Home() {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const { user: authUser, logout } = useAuth();
  const userId = authUser?.id || authUser?.idUsuario;

  // --- QUERIES ---

  // 1. Datos del Usuario (Puntos, Dirección, etc.)
  const { data: userData, refetch: refetchUser } = useQuery({
    queryKey: ["userDetail", userId],
    queryFn: async () => {
      const res = await apiRequest("GET", `/usuarios/${userId}`);
      const json = await res.json();
      return json.user || json;
    },
    enabled: !!userId,
  });

  // 2. Mis Retiros (Entregas de materiales)
  const {
    data: entregas,
    refetch: refetchEntregas,
    isLoading: loadingEntregas,
  } = useQuery({
    queryKey: ["mis-entregas", userId],
    queryFn: async () => {
      const res = await apiRequest("GET", "/entregas/mis-entregas");
      const json = await res.json();
      return json.entregas || [];
    },
    enabled: !!userId,
  });

  // 3. Eventos Disponibles para inscribirse (Upcoming)
  const { data: eventosDisponibles, refetch: refetchDisponibles } = useQuery({
    queryKey: ["eventos-disponibles"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/eventos?upcoming=true");
      const json = await res.json();
      return json.data || []; // Según tu controlador devuelve { ok: true, data: [] }
    },
  });

  // 4. Mis Eventos (Donde ya estoy inscrito)
  const { data: misEventos, refetch: refetchMisEventos } = useQuery({
    queryKey: ["mis-eventos", userId],
    queryFn: async () => {
      const res = await apiRequest("GET", `/eventos/user/${userId}`);
      const json = await res.json();
      return json.data || json.eventos || [];
    },
    enabled: !!userId,
  });

  // --- MUTACIONES / ACCIONES ---

  const handleInscribirse = async (idEvento: number) => {
    try {
      const res = await apiRequest("POST", `/eventos/${idEvento}/inscribir`);
      const json = await res.json();

      if (json.ok) {
        Alert.alert("¡Éxito!", "Te has inscrito correctamente al evento.");
        // Refrescamos todo para mover el evento de una lista a otra
        queryClient.invalidateQueries({ queryKey: ["eventos-disponibles"] });
        queryClient.invalidateQueries({ queryKey: ["mis-eventos"] });
        refetchUser();
      } else {
        Alert.alert(
          "Atención",
          json.mensaje || "No se pudo completar la inscripción.",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema de conexión.");
    }
  };

  const displayUser = userData || authUser;

  const onRefresh = () => {
    refetchUser();
    refetchEntregas();
    refetchDisponibles();
    refetchMisEventos();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loadingEntregas}
            onRefresh={onRefresh}
            tintColor="#1f5c2e"
          />
        }
      >
        {/* Header con Saludo */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>¡Hola,</Text>
              <Text style={styles.userName}>
                {displayUser?.nombre || "Usuario"}! 👋
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              style={styles.avatarMini}
            >
              <Text style={styles.avatarLetter}>
                {displayUser?.nombre?.charAt(0).toUpperCase() || "U"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.locationBadge}>
            <MapPin size={14} color="#3f8f3a" />
            <Text style={styles.locationText}>
              {displayUser?.direccion || "Sin dirección configurada"}
            </Text>
          </View>

          {/* Card de Puntos */}
          <Card style={styles.pointsCard}>
            <View style={styles.pointsRow}>
              <View>
                <Text style={styles.pointsLabel}>Puntos Acumulados</Text>
                <View style={styles.pointsContainer}>
                  <Text style={styles.pointsValue}>
                    {displayUser?.puntosAcumulados ?? 0}
                  </Text>
                  <Text style={styles.pointsUnit}> pts</Text>
                </View>
              </View>
              <Award size={42} color="#1f5c2e" opacity={0.15} />
            </View>
          </Card>

          {/* Acceso Principal a Retiros */}
          <TouchableOpacity
            style={styles.mainAction}
            onPress={() => navigation.navigate("Solicitar Retiro")}
          >
            <View style={styles.actionIcon}>
              <Recycle size={28} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Solicitar Retiro</Text>
              <Text style={styles.actionSub}>
                Programá tu recolección de residuos
              </Text>
            </View>
            <ChevronRight size={20} color="#fff" />
          </TouchableOpacity>

          {/* --- SECCIÓN: DESCUBRIR EVENTOS (Inscripción) --- */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Descubrir Eventos</Text>
          </View>

          {eventosDisponibles?.filter((e: any) => !e.inscrito).length > 0 ? (
            eventosDisponibles
              .filter((e: any) => !e.inscrito)
              .slice(0, 3)
              .map((ev: any) => (
                <View key={ev.idEvento} style={styles.inscribeCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{ev.nombre}</Text>
                    <Text style={styles.itemSub}>
                      📅 {new Date(ev.fecha).toLocaleDateString()} • ⭐{" "}
                      {ev.puntosOtorgados} pts
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.inscribeButton}
                    onPress={() => handleInscribirse(ev.idEvento)}
                  >
                    <Text style={styles.inscribeButtonText}>Inscribirme</Text>
                  </TouchableOpacity>
                </View>
              ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                No hay eventos nuevos por ahora.
              </Text>
            </View>
          )}

          {/* --- SECCIÓN: ÚLTIMOS RETIROS --- */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis últimos retiros</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Historial")}>
              <Text style={styles.seeMore}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          {entregas?.length > 0 ? (
            entregas.slice(0, 2).map((item: any) => (
              <View key={item.idEntrega} style={styles.itemRow}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        item.estadoPuntos === "confirmado"
                          ? "#10b981"
                          : "#f59e0b",
                    },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.detalleMateriales}</Text>
                  <Text style={styles.itemSub}>
                    {new Date(item.fechaSolicitud).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.itemPoints}>+{item.puntosGanados} pts</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Aún no has realizado retiros.</Text>
          )}

          {/* --- SECCIÓN: EVENTOS ASISTIDOS / INSCRITO --- */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis Eventos</Text>
          </View>

          {misEventos?.length > 0 ? (
            misEventos.map((ev: any) => (
              <View key={ev.idEvento || ev.id} style={styles.eventCard}>
                <CalendarCheck size={20} color="#1f5c2e" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.itemTitle}>{ev.nombre}</Text>
                  <Text style={styles.itemSub}>
                    Inscrito para el {new Date(ev.fecha).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                No estás inscrito en ningún evento.
              </Text>
            </View>
          )}

          {/* Botón Cerrar Sesión */}
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <LogOut size={18} color="#ef4444" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdfbf7" },
  header: {
    backgroundColor: "#1f5c2e",
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 65,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: { color: "#a7d1a7", fontSize: 16 },
  userName: { color: "#fff", fontSize: 28, fontWeight: "bold" },
  avatarMini: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3f8f3a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#a7d1a7",
  },
  avatarLetter: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  content: { paddingHorizontal: 20, marginTop: -35 },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 2,
    marginBottom: 15,
  },
  locationText: { marginLeft: 5, fontSize: 12, color: "#4b5563" },
  pointsCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 3,
  },
  pointsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pointsLabel: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  pointsContainer: { flexDirection: "row", alignItems: "baseline" },
  pointsValue: { fontSize: 38, fontWeight: "bold", color: "#1f5c2e" },
  pointsUnit: { fontSize: 16, color: "#1f5c2e" },
  mainAction: {
    backgroundColor: "#3f8f3a",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    elevation: 4,
  },
  actionIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 12,
    marginRight: 15,
  },
  actionTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  actionSub: { color: "#dcfce7", fontSize: 12 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  seeMore: { color: "#1f5c2e", fontSize: 14, fontWeight: "600" },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 1,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  itemTitle: { fontSize: 15, fontWeight: "600", color: "#374151" },
  itemSub: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  itemPoints: { fontWeight: "bold", color: "#1f5c2e" },
  inscribeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 18,
    marginBottom: 10,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: "#3f8f3a",
  },
  inscribeButton: {
    backgroundColor: "#1f5c2e",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  inscribeButtonText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#1f5c2e",
    opacity: 0.9,
  },
  emptyCard: {
    padding: 20,
    backgroundColor: "#f3f4f6",
    borderRadius: 15,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  emptyText: { color: "#9ca3af", textAlign: "center", fontSize: 13 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    gap: 8,
    paddingBottom: 40,
  },
  logoutText: { color: "#ef4444", fontWeight: "700" },
});
