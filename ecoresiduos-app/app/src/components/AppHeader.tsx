import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Button } from '../../src/components/ui/button';
import { useNavigation } from '@react-navigation/native'; 

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  action?: React.ReactNode;
}

export default function AppHeader({ title, showBack = false, action }: AppHeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBack && (
            <Button
              size="icon"
              variant="ghost"
              onPress={() => navigation.goBack()}
              testID="button-back"
            >
              <ArrowLeft size={20} color="#6b7280" />
            </Button>
          )}
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>
        {action && <View style={styles.rightSection}>{action}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    zIndex: 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  rightSection: {
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
});
