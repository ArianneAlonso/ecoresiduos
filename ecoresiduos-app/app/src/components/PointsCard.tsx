import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Award, TrendingUp } from 'lucide-react-native';
import { Card } from '../../src/components/ui/card';

interface PointsCardProps {
  points: number;
  change?: number;
}

export default function PointsCard({ points, change }: PointsCardProps) {
  return (
    <View style={styles.gradientContainer}>
      <Card style={styles.card}>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.subtitle}>Puntos Ecológicos</Text>
            <Text style={styles.points} testID="text-points">
              {points.toLocaleString()}
            </Text>
            {change !== undefined && (
              <View style={styles.changeContainer}>
                <TrendingUp size={16} color="#10b981" />
                <Text style={styles.changeText}>+{change} esta semana</Text>
              </View>
            )}
          </View>
          <View style={styles.iconContainer}>
            <Award size={32} color="#fff" />
          </View>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  card: {
    padding: 24,
    backgroundColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  points: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  changeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
