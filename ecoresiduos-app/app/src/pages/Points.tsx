import { Award, TrendingUp, History } from 'lucide-react-native';
import AppHeader from '../../src/components/AppHeader';
import PointsCard from '../../src/components/PointsCard';
import RewardCard from '../../src/components/RewardCard';
import { Card } from '../../src/components/ui/card';
import { Badge } from '../../src/components/ui/badge';
import { Button } from '../../src/components/ui/button';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const rewards = [
  {
    id: "1",
    title: "20% de descuento",
    description: "En tu próxima compra en productos ecológicos",
    pointsRequired: 500,
    merchant: "EcoTienda Verde",
  },
  {
    id: "2",
    title: "Café gratis",
    description: "Una bebida de tu elección",
    pointsRequired: 300,
    merchant: "Café Sustentable",
  },
  {
    id: "3",
    title: "Bolsa reutilizable",
    description: "Bolsa ecológica premium de tela orgánica",
    pointsRequired: 800,
    merchant: "EcoResiduos Store",
  },
];

const history = [
  { date: "28 Oct", action: "Retiro completado", points: "+50" },
  { date: "25 Oct", action: "Evento asistido", points: "+100" },
  { date: "22 Oct", action: "Retiro completado", points: "+50" },
  { date: "20 Oct", action: "Bono semanal", points: "+25" },
];

export default function Points() {
  return (
    <View style={styles.container}>
      <AppHeader 
        title="Mis Puntos"
        action={
          <TouchableOpacity testID="button-history">
            <Text style={styles.historyLink}>Historial</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <PointsCard points={1250} change={85} />

        <Card style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={styles.levelIcon}>
              <TrendingUp size={20} color="#6b7280" />
            </View>
            <View>
              <Text style={styles.levelTitle}>Nivel: Eco Warrior</Text>
              <Text style={styles.levelSubtitle}>750 puntos para el siguiente nivel</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </Card>

        <View style={styles.rewardsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recompensas Destacadas</Text>
            <Badge variant="secondary" style={styles.rewardsBadge}>
              <Award size={12} color="#6b7280" style={styles.badgeIcon} />
              {rewards.length}
            </Badge>
          </View>
          <View style={styles.rewardsGrid}>
            {rewards.slice(0, 2).map((reward) => (
              <RewardCard 
                key={reward.id}
                title={reward.title}
                description={reward.description}
                pointsRequired={reward.pointsRequired}
                merchant={reward.merchant}
              />
            ))}
          </View>
          <Button 
            variant="outline" 
            style={styles.viewAllButton}
            testID="button-view-all-rewards"
            onPress={() => console.log('Ver todas las recompensas')}
          >
            Ver Todas las Recompensas
          </Button>
        </View>

        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <History size={20} color="#1f5c2e" />
            <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          </View>
          <Card style={styles.historyCard}>
            {history.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyContent}>
                  <Text style={styles.historyAction}>{item.action}</Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </View>
                <Text style={styles.historyPoints}>{item.points}</Text>
              </View>
            ))}
          </Card>
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
    paddingBottom: 100,
  },
  levelCard: {
    padding: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  levelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  levelSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6b7280',
    width: '62%',
    borderRadius: 4,
  },
  rewardsSection: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  rewardsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeIcon: {
    marginRight: 4,
  },
  rewardsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  viewAllButton: {
    marginTop: 8,
  },
  historySection: {
    gap: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyCard: {
    gap: 0,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  historyContent: {
    flex: 1,
  },
  historyAction: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  historyDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  historyPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  historyLink: {
    fontSize: 14,
    color: '#1f5c2e',
    fontWeight: '500',
  },
});
