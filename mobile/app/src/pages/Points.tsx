import { useQuery } from "@tanstack/react-query";
import { History as HistoryIcon, TrendingUp } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../context/useContext";
import { apiRequest } from "../lib/queryClient";

import AppHeader from "../components/AppHeader";
import PointsCard from "../components/PointsCard";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";

export default function Points() {
  const { user: authUser } = useAuth();
  const userId = authUser?.id || authUser?.idUsuario;

  // 1. Una sola llamada que trae TODO (Perfil + Historial)
  const { data: userData, isLoading } = useQuery({
    queryKey: ["userDetail", userId],
    queryFn: async () => {
      const res = await apiRequest("GET", `/usuarios/${userId}`);
      const json = await res.json();
      // Según lo que me pasaste, los datos vienen directo o en .user
      return json.user || json;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1f5c2e" />
      </View>
    );
  }

  // Extraemos los datos de la respuesta que me mostraste
  const puntos = userData?.puntosAcumulados ?? 0;
  const historial = userData?.historialEntregas || [];

  return (
    <View style={styles.container}>
      <AppHeader title="Mis Puntos" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Puntos Reales */}
        <PointsCard points={puntos} change={0} />

        {/* Nivel Dinámico */}
        <Card style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={styles.levelIcon}>
              <TrendingUp size={20} color="#1f5c2e" />
            </View>
            <View>
              <Text style={styles.levelTitle}>
                Nivel: {puntos > 500 ? "Eco Master" : "Eco Iniciado"}
              </Text>
              <Text style={styles.levelSubtitle}>
                {puntos >= 1000
                  ? "¡Nivel máximo!"
                  : `${1000 - puntos} pts para el siguiente nivel`}
              </Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min((puntos / 1000) * 100, 100)}%` },
              ]}
            />
          </View>
        </Card>

        {/* Actividad Reciente desde historialEntregas */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <HistoryIcon size={20} color="#1f5c2e" />
            <Text style={styles.sectionTitle}>Historial de Entregas</Text>
            <Badge variant="secondary">{historial.length}</Badge>
          </View>

          <Card style={styles.historyCard}>
            {historial.length > 0 ? (
              historial.map((item: any, index: number) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyContent}>
                    <Text style={styles.historyAction}>
                      Entrega de Residuos
                    </Text>
                    <Text style={styles.historyDate}>
                      {new Date(item.fecha).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={[styles.historyPoints, { color: "#1f5c2e" }]}>
                    +{item.puntosOtorgados || 0}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Aún no tienes entregas registradas.
                </Text>
              </View>
            )}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdfbf7" },
  content: { flex: 1, padding: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  levelCard: { padding: 16, marginBottom: 20, borderRadius: 20 },
  levelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  levelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
  },
  levelTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  levelSubtitle: { fontSize: 13, color: "#6b7280" },
  progressBar: { height: 8, backgroundColor: "#f3f4f6", borderRadius: 4 },
  progressFill: { height: "100%", backgroundColor: "#1f5c2e", borderRadius: 4 },
  historySection: { marginTop: 10 },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#111827", flex: 1 },
  historyCard: { borderRadius: 20, overflow: "hidden" },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  historyContent: { flex: 1 },
  historyAction: { fontSize: 14, fontWeight: "600", color: "#111827" },
  historyDate: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  historyPoints: { fontSize: 15, fontWeight: "bold" },
  emptyContainer: { padding: 30, alignItems: "center" },
  emptyText: { color: "#9ca3af", fontSize: 14 },
});
