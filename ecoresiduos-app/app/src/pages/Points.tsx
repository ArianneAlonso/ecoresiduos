import { Award, TrendingUp, History } from 'lucide-react-native';
import AppHeader from '../../src/components/AppHeader';
import PointsCard from '../../src/components/PointsCard';
import RewardCard from '../../src/components/RewardCard';
import { Card } from '../../src/components/ui/card';
import { Badge } from '../../src/components/ui/badge';
import { Button } from '../../src/components/ui/button';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

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
        title=""

      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <PointsCard points={1250} change={85} />


        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <History size={20} color="#4caf50" />
            <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          </View>

          <Card style={styles.historyCard}>
            {history.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.historyItem,
                  index !== history.length - 1 && styles.historyDivider,
                ]}
              >
                <View style={styles.historyLeft}>
                  <View style={styles.historyDot} />
                  <View>
                    <Text style={styles.historyAction}>{item.action}</Text>
                    <Text style={styles.historyDate}>{item.date}</Text>
                  </View>
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
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
    gap: 16,
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
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
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
    backgroundColor: '#e8f5e9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  rewardsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#e8f5e9',
  },
  badgeIcon: {
    marginRight: 4,
  },
  rewardsGrid: {
    gap: 12,
  },
  viewAllButton: {
    marginTop: 8,
  },
  historySection: {
    gap: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyCard: {
    paddingVertical: 4,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  historyDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4caf50',
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
    fontWeight: '700',
    color: '#4caf50',
  },
  historyLink: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: '500',
  },
});