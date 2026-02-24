'use client';

import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AppHeader from '../AppHeader';
import { Settings } from 'lucide-react-native';

export default function AppHeaderExample() {
  return (
    <View style={styles.container}>
      <AppHeader 
        title="Mi Perfil" 
        showBack 
        action={
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Settings size={20} color="#000" />
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D4D4D8',
    backgroundColor: 'transparent',
  },
});
