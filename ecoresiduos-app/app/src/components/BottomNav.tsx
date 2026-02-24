import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { 
  Home, 
  MapPin, 
  Award, 
  Calendar, 
  User 
} from 'lucide-react-native';

interface NavItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Inicio", path: "/" },
  { icon: MapPin, label: "Mapa", path: "/map" },
  { icon: Award, label: "Puntos", path: "/points" },
  { icon: Calendar, label: "Eventos", path: "/events" },
  { icon: User, label: "Perfil", path: "/profile" },
];

export default function BottomNav() {
  return (
    <View style={styles.nav}>
      <View style={styles.content}>
        {navItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <TouchableOpacity
              key={item.path}
              style={styles.navItem}
              onPress={() => console.log('Navigate to:', item.path)} // ← Reemplaza con tu navegación
              testID={`nav-${item.label.toLowerCase()}`}
              activeOpacity={0.7}
            >
              <Icon 
                size={20} 
                color="#6b7280"
              />
              <Text style={styles.label}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    zIndex: 50,
    paddingBottom: 34, 
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 83,
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    borderRadius: 12,
    gap: 4,
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    lineHeight: 14,
  },
});
