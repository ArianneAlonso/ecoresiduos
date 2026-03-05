import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native'; 
import { Card } from '../../src/components/ui/card'; 

interface MaterialCardProps {
  icon: LucideIcon;
  label: string;
  selected: boolean;
  onPress: () => void; 
}

export default function MaterialCard({ icon: Icon, label, selected, onPress }: MaterialCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && styles.cardSelected
      ]}
      onPress={onPress}
      testID={`material-${label.toLowerCase()}`}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={[
          styles.iconContainer,
          selected ? styles.iconSelected : styles.iconDefault
        ]}>
          <Icon size={32} color={selected ? '#fff' : '#6b7280'} />
        </View>
        <Text style={[
          styles.label,
          selected && styles.labelSelected
        ]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#1f5c2e',
    backgroundColor: '#f0f9ff',
    shadowColor: '#1f5c2e',
    shadowOpacity: 0.25,
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDefault: {
    backgroundColor: '#f1f5f9',
  },
  iconSelected: {
    backgroundColor: '#1f5c2e',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  labelSelected: {
    color: '#1e40af',
    fontWeight: '600',
  },
});
