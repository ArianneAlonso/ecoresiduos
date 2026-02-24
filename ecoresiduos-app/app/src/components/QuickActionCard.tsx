import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { Card } from '../../src/components/ui/card';

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onPress: () => void;
}

export default function QuickActionCard({ icon: Icon, title, description, onPress }: QuickActionCardProps) {
  return (
    <TouchableOpacity
      style={styles.touchable}
      onPress={onPress}
      testID={`action-${title.toLowerCase().replace(/\s+/g, '-')}`}
      activeOpacity={0.7}
    >
      <Card style={styles.card}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Icon size={24} color="#1f5c2e" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <Text style={styles.description} numberOfLines={2}>{description}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    minWidth: 240,
  },
  card: {
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
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
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});
