import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, Clock, Trash2 } from 'lucide-react-native';
import { Card } from '../../src/components/ui/card';
import { Badge } from '../../src/components/ui/badge';

interface UpcomingCollectionProps {
  date: string;
  time: string;
  materials: string[];
  daysUntil: number;
}

export default function UpcomingCollection({ date, time, materials, daysUntil }: UpcomingCollectionProps) {
  const daysText = daysUntil === 0 ? "Hoy" : daysUntil === 1 ? "Mañana" : `En ${daysUntil} días`;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Próxima Recolección</Text>
          <Text style={styles.daysText}>{daysText}</Text>
        </View>
        <View style={styles.trashIcon}>
          <Trash2 size={20} color="#6b7280" />
        </View>
      </View>
      
      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          <Calendar size={16} color="#6b7280" />
          <Text style={styles.metaText}>{date}</Text>
        </View>
        <View style={styles.metaItem}>
          <Clock size={16} color="#6b7280" />
          <Text style={styles.metaText}>{time}</Text>
        </View>
      </View>
      
      <View style={styles.materialsContainer}>
        {materials.map((material) => (
          <Badge key={material} variant="secondary" style={styles.badge}>
            {material}
          </Badge>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  daysText: {
    fontSize: 14,
    color: '#6b7280',
  },
  trashIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaContainer: {
    gap: 8,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#111827',
  },
  materialsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
