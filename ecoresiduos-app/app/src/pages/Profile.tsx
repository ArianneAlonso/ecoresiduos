import { User, MapPin, Bell, HelpCircle, LogOut, ChevronRight, Award, Leaf } from 'lucide-react-native';
import AppHeader from '../../src/components/AppHeader';
import PointsCard from '../../src/components/PointsCard';
import { Card } from '../../src/components/ui/card';
import { Avatar, AvatarFallback } from '../../src/components/ui/avatar';
import { Button } from '../../src/components/ui/button';
import { Badge } from '../../src/components/ui/badge';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const menuItems = [
  { icon: MapPin, label: "Mi Ubicación", description: "Av. Principal 123" },
  { icon: Bell, label: "Notificaciones", description: "Activas" },
  { icon: HelpCircle, label: "Ayuda y Soporte", description: "Centro de ayuda" },
];

const stats = [
  { label: "Retiros", value: "12", icon: Leaf },
  { label: "Eventos", value: "5", icon: Award },
  { label: "Kg Reciclados", value: "48", icon: Leaf },
];

export default function Profile() {
  return (
    <View style={styles.container}>
      <AppHeader title="Mi Perfil" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <PointsCard points={1250} change={85} />
        
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.customAvatar}>
              <AvatarFallback style={styles.avatarFallback}>
                U
              </AvatarFallback>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Usuario EcoResiduos</Text>
              <Text style={styles.profileEmail}>usuario@email.com</Text>
              <Badge variant="secondary" style={styles.levelBadge}>
                <Award size={12} color="#6b7280" style={styles.badgeIcon} />
                Eco Warrior
              </Badge>
            </View>
          </View>

          <View style={styles.statsGrid}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <View key={stat.label} style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Icon size={24} color="#1f5c2e" />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          <Card style={styles.menuCard}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={item.label}
                  style={styles.menuItem}
                  onPress={() => console.log(`Navigate to ${item.label}`)}
                  testID={`button-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <View style={styles.menuIcon}>
                    <Icon size={20} color="#374151" />
                  </View>
                  <View style={styles.menuContent}>
                    <Text style={styles.menuTitle}>{item.label}</Text>
                    <Text style={styles.menuDescription}>{item.description}</Text>
                  </View>
                  <ChevronRight size={20} color="#6b7280" />
                </TouchableOpacity>
              );
            })}
          </Card>
        </View>

        <Button
          variant="outline"
          style={styles.logoutButton}
          testID="button-logout"
        >
          <LogOut size={16} color="#ef4444" style={styles.logoutIcon} />
          <Text>Cerrar Sesión</Text>
        </Button>
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
  profileCard: {
    padding: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  customAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1f5c2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarFallback: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeIcon: {
    marginRight: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  settingsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  menuCard: {
    gap: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  menuDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutButton: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 12,
  },
  logoutIcon: {
    marginRight: 4,
  },
});
