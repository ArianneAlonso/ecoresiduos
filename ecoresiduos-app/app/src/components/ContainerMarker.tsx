import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Card } from '../../src/components/ui/card';
import { Badge } from '../../src/components/ui/badge';

interface ContainerMarkerProps {
  type: string;
  address: string;
  materials: string[];
  distance?: string;
  schedule?: string;
}

export default function ContainerMarker({ 
  type, 
  address, 
  materials, 
  distance, 
  schedule 
}: ContainerMarkerProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MapPin size={20} color="#1f5c2e" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{type}</Text>
          <Text style={styles.address} numberOfLines={2}>{address}</Text>
          
          {distance && <Text style={styles.distance}>{distance}</Text>}
          
          <View style={styles.materialsContainer}>
            {materials.map((material) => (
              <Badge 
                key={material} 
                variant="secondary" 
                style={styles.badge}
              >
                {material}
              </Badge>
            ))}
          </View>
          
          {schedule && <Text style={styles.schedule}>{schedule}</Text>}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  distance: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  materialsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  schedule: {
    fontSize: 12,
    color: '#6b7280',
  },
});
