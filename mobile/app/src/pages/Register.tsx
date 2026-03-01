import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { Lock, Mail, MapPin, User } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../../context/useContext";
import { Button } from "../../src/components/ui/button";
import { Card } from "../../src/components/ui/card";
import { Input } from "../../src/components/ui/input";
import { Label } from "../../src/components/ui/label";
import { apiRequest } from "../lib/queryClient"; // Importamos tu configuracion de API

export default function Register() {
  const navigation = useNavigation<any>();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  // Mutación para registrar al usuario
  const registerMutation = useMutation({
    mutationFn: async (newUser: any) => {
      // Ajustamos el endpoint a la estructura que vimos en tu servidor
      const res = await apiRequest("POST", "/usuarios/register", newUser);
      return res.json();
    },
    onSuccess: (data) => {
      // 'data' debería ser algo como { ok: true, user: { idUsuario: 1, nombre: "..." } }
      if (data.ok) {
        Alert.alert("¡Éxito!", "Cuenta creada correctamente");
        login(data.user); // Pasamos solo el objeto del usuario al contexto
      }
    },
    onError: (error: Error) => {
      Alert.alert(
        "Error de registro",
        error.message || "No se pudo crear la cuenta",
      );
    },
  });

  const handleRegister = () => {
    const emailRegex = /\S+@\S+\.\S+/;

    if (!name || !email || !password || !address) {
      Alert.alert("Campos incompletos", "Por favor llena todos los datos");
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert(
        "Email inválido",
        "Por favor ingresa un correo electrónico real",
      );
      return;
    }

    registerMutation.mutate({
      nombre: name,
      email: email,
      password: password,
      direccion: address,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.hero}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>
            Únete a la comunidad eco-responsable
          </Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.form}>
            {/* Nombre */}
            <View style={styles.inputGroup}>
              <Label>Nombre completo</Label>
              <View style={styles.inputWrapper}>
                <User size={20} color="#3f8f3a" style={styles.inputIcon} />
                <Input
                  placeholder="Juan Pérez"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Label>Correo electrónico</Label>
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

            {/* Password */}
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

            {/* Dirección */}
            <View style={styles.inputGroup}>
              <Label>Dirección</Label>
              <View style={styles.inputWrapper}>
                <MapPin size={20} color="#3f8f3a" style={styles.inputIcon} />
                <Input
                  placeholder="Av. Principal 123"
                  value={address}
                  onChangeText={setAddress}
                  style={styles.input}
                />
              </View>
            </View>

            <Button
              onPress={handleRegister}
              style={styles.button}
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Crear Cuenta
                </Text>
              )}
            </Button>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e9e1cf" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", padding: 20 },
  hero: { alignItems: "center", marginBottom: 28 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f5c2e",
    marginBottom: 6,
  },
  subtitle: { fontSize: 15, color: "#3f8f3a", textAlign: "center" },
  card: {
    padding: 24,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    elevation: 4,
  },
  form: { gap: 16 },
  inputGroup: { gap: 8 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f1e8",
    borderRadius: 14,
    paddingHorizontal: 10,
  },
  inputIcon: { marginRight: 6 },
  input: { flex: 1, paddingVertical: 12 },
  button: {
    marginTop: 14,
    backgroundColor: "#1f5c2e",
    borderRadius: 14,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: { marginTop: 28, alignItems: "center", gap: 4 },
  footerText: { fontSize: 14, color: "#1f5c2e" },
  loginLink: { fontSize: 15, color: "#3f8f3a", fontWeight: "600" },
});
