import { useState } from 'react';
import { Mail, Lock } from 'lucide-react-native';
import { Button } from '../../src/components/ui/button';
import { Input } from '../../src/components/ui/input';
import { Label } from '../../src/components/ui/label';
import { Card } from '../../src/components/ui/card';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login:', { email, password });
    navigation.replace('MainTabs');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.hero}>
          <Text style={styles.title}>EcoResiduos</Text>
          <Text style={styles.subtitle}>
            Gestión inteligente de reciclaje
          </Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Label>Email</Label>
              <View style={styles.inputWrapper}>
                <Mail size={20} color="#3f8f3a" style={styles.inputIcon} />
                <Input
                  placeholder="tu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Label>Contraseña</Label>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#3f8f3a" style={styles.inputIcon} />
                <Input
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            </View>

            <Button
              onPress={handleLogin}
              style={styles.button}
            >
              Iniciar Sesión
            </Button>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              ¿No tienes una cuenta?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>
                Regístrate
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9e1cf',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#1f5c2e',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#3f8f3a',
    textAlign: 'center',
  },
  card: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    elevation: 4,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f1e8',
    borderRadius: 14,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  button: {
    marginTop: 14,
    backgroundColor: '#1f5c2e',
    borderRadius: 14,
  },
  footer: {
    marginTop: 28,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    color: '#1f5c2e',
  },
  registerLink: {
    fontSize: 15,
    color: '#3f8f3a',
    fontWeight: '600',
  },
});
