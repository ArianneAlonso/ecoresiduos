import { Calendar as CalendarIcon, MapPin, Users } from 'lucide-react-native';
import AppHeader from '../../src/components/AppHeader';
import EventCard from '../../src/components/EventCard';
import { Card } from '../../src/components/ui/card';
import { Badge } from '../../src/components/ui/badge';
import { View, Text, StyleSheet } from 'react-native';

const events = [
  {
    id: "1",
    title: "Jornada de Limpieza",
    date: "Sábado, 5 de Noviembre - 9:00 AM",
    location: "Plaza Central",
    description: "Únete a nuestra jornada de limpieza comunitaria y gana puntos extra por participar",
    attendees: 45,
  },
  {
    id: "2",
    title: "Taller de Reciclaje",
    date: "Miércoles, 10 de Noviembre - 3:00 PM",
    location: "Centro Comunitario",
    description: "Aprende técnicas avanzadas de separación de residuos y reciclaje creativo",
    attendees: 28,
  },
  {
    id: "3",
    title: "Feria Eco-Sostenible",
    date: "Domingo, 15 de Noviembre - 10:00 AM",
    location: "Parque Municipal",
    description: "Conoce productos sustentables y participa en actividades ecológicas para toda la familia",
    attendees: 120,
  },
];

const upcomingDays = [
  { day: "Lun", date: "1", hasEvent: false },
  { day: "Mar", date: "2", hasEvent: false },
  { day: "Mié", date: "3", hasEvent: false },
  { day: "Jue", date: "4", hasEvent: false },
  { day: "Vie", date: "5", hasEvent: true },
  { day: "Sáb", date: "6", hasEvent: false },
  { day: "Dom", date: "7", hasEvent: false },
];

export default function Events() {
  return (
    <View style={styles.container}>
      <AppHeader title="Eventos Ambientales" showBack />

      <View style={styles.content}>
        <Card style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <CalendarIcon size={20} color="#1f5c2e" />
            <Text style={styles.calendarTitle}>Noviembre 2025</Text>
          </View>
          
          <View style={styles.calendarGrid}>
            {upcomingDays.map((day) => (
              <View
                key={day.date}
                style={[
                  styles.calendarDay,
                  day.hasEvent && styles.calendarDayActive
                ]}
              >
                <Text style={styles.dayAbbr}>{day.day}</Text>
                <Text style={styles.dayNumber}>{day.date}</Text>
                {day.hasEvent && <View style={styles.eventDot} />}
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.eventsSection}>
          <View style={styles.eventsHeader}>
            <Text style={styles.eventsTitle}>Próximos Eventos</Text>
            <Badge variant="secondary" style={styles.badge}>
              {events.length} eventos
            </Badge>
          </View>
          
          <View style={styles.eventsList}>
            {events.map((event) => (
              <View key={event.id} style={styles.eventItem}>
                <EventCard 
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  description={event.description}
                />
                <View style={styles.attendees}>
                  <Users size={16} color="#6b7280" />
                  <Text style={styles.attendeesText}>
                    {event.attendees} personas confirmadas
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 80, // Espacio para BottomNav
  },
  content: {
    padding: 16,
    gap: 24,
  },
  calendarCard: {
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  calendarDay: {
    flex: 1,
    minWidth: 40,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  calendarDayActive: {
    backgroundColor: '#1f5c2e',
  },
  dayAbbr: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
    marginTop: 4,
  },
  eventsSection: {},
  eventsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  eventsList: {
    gap: 12,
  },
  eventItem: {},
  attendees: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    marginLeft: 16,
  },
  attendeesText: {
    fontSize: 12,
    color: '#6b7280',
  },
});
