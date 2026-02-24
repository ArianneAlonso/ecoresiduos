import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
};

type WelcomeScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({
  navigation,
}: {
  navigation: WelcomeScreenNavigationProp;
}) {
  const handleStart = () => {
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Eco</Text>
          <Text style={styles.logoTextD}>Residuos</Text>
        </View>

        <Text style={styles.title}>Gestiona y Aprovecha</Text>
        <Text style={styles.subtitle}>tus residuos</Text>

        <Image
          source={require('../../../images/EcoWelcome.png')}
          style={styles.image}
        />

        <Text style={styles.tagline}>
          Comienza a transformar tus residuos en recompensas
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Comenzar</Text>
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
    backgroundColor: '#fff',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
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
    fontSize: 28,
    color: '#4caf50',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  tagline: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 60,
  },
  button: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: '#9ccc65',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});
