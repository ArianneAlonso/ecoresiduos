import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Leaf, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
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
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { apiRequest } from "../lib/queryClient";

export default function Login() {
  const navigation = useNavigation<any>();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      const res = await apiRequest("POST", "/usuarios/login", credentials);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensaje || "Credenciales incorrectas");
      }
      return data;
    },
    onSuccess: (data) => {
      // Extraemos el usuario. Si el backend responde { ok: true, user: {...} }
      // usamos data.user. Si los manda directo, usamos data.
      const userPayload = data.user || data;

      if (userPayload && typeof userPayload === "object") {
        console.log(
          "🔐 Login exitoso. Usuario:",
          userPayload.nombre || userPayload.email,
        );
        login(userPayload);
        // El AppRouter en App.tsx detectará el cambio de isLoggedIn y cambiará la pantalla
      } else {
        Alert.alert("Error", "No se recibieron datos de usuario válidos.");
      }
    },
    onError: (error: Error) => {
      Alert.alert("Error de acceso", error.message);
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Campos incompletos", "Por favor, ingresa tus credenciales.");
      return;
    }
    // Normalizamos el email para evitar errores por mayúsculas o espacios
    loginMutation.mutate({
      email: email.toLowerCase().trim(),
      password,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Sección de Logo/Hero */}
        <View style={styles.hero}>
          <View style={styles.iconContainer}>
            <Leaf size={40} color="#fff" />
          </View>
          <Text style={styles.title}>EcoResiduos</Text>
          <Text style={styles.subtitle}>Hacia un futuro más sostenible</Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.form}>
            {/* Campo Email */}
            <View style={styles.inputGroup}>
              <Label style={styles.label}>Correo Electrónico</Label>
              <View style={styles.inputWrapper}>
                <Mail size={20} color="#3f8f3a" style={styles.inputIcon} />
                <Input
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
            </View>

            {/* Campo Contraseña */}
            <View style={styles.inputGroup}>
              <Label style={styles.label}>Contraseña</Label>
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
              style={styles.loginButton}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Entrar</Text>
                  <ArrowRight size={18} color="#fff" />
                </View>
              )}
            </Button>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Eres nuevo?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>Crea una cuenta aquí</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdfbf7" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", padding: 25 },
  hero: { alignItems: "center", marginBottom: 40 },
  iconContainer: {
    backgroundColor: "#1f5c2e",
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f5c2e",
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: 16, color: "#6b7280", marginTop: 5 },
  card: {
    padding: 24,
    borderRadius: 25,
    backgroundColor: "#ffffff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { color: "#374151", fontWeight: "600", marginLeft: 4 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, color: "#1f2937" },
  loginButton: {
    marginTop: 10,
    backgroundColor: "#1f5c2e",
    borderRadius: 15,
    height: 55,
  },
  buttonContent: { flexDirection: "row", alignItems: "center", gap: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  footer: { marginTop: 30, alignItems: "center", gap: 5 },
  footerText: { color: "#6b7280", fontSize: 14 },
  registerLink: { color: "#1f5c2e", fontWeight: "bold", fontSize: 15 },
});
