import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  HomeConductor: undefined;
  MapaRecorrido: undefined;
  QR: undefined;
  Login: undefined;
};

type HomeConductorNavigationProp =
  NativeStackNavigationProp<RootStackParamList, 'HomeConductor'>;

export default function HomeConductor({
  navigation,
}: {
  navigation: HomeConductorNavigationProp;
}) {

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Eco</Text>
          <Text style={styles.logoTextD}>Residuos</Text>
        </View>

        <Text style={styles.title}>Panel del Conductor</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MapaRecorrido')}
        >
          <Text style={styles.buttonText}>Ver Recorrido</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('QR')}
        >
          <Text style={styles.buttonText}>Generar QR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
    marginRight: 5,
  },
  logoTextD: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 26,
    color: '#4caf50',
    fontWeight: 'bold',
    marginBottom: 50,
  },
  button: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: '#9ccc65',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});