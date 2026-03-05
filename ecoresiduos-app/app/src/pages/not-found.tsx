import { Card, CardContent } from '../../src/components/ui/card';
import { AlertCircle } from 'lucide-react-native';
import { View, Text, StyleSheet } from 'react-native';

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <CardContent style={styles.content}>
          <View style={styles.header}>
            <AlertCircle size={32} color="#ef4444" />
            <Text style={styles.title}>Página No Encontrada</Text>
          </View>

          <Text style={styles.description}>
            La página que buscas no existe o fue movida.
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  content: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    textAlign: 'center',
  },
});
