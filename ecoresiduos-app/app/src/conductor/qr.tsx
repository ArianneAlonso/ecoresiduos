import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';

export default function QR() {
  const idCasa = 1;
  const idConductor = 10;

  const qrValue = JSON.stringify({
    casa: idCasa,
    conductor: idConductor,
    fecha: new Date().toISOString(),
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Escanear para Confirmar Retiro</Text>

        <View style={styles.qrContainer}>
          <QRCode
            value={qrValue}
            size={220}
            color="#4caf50"
            backgroundColor="white"
          />
        </View>

        <Text style={styles.infoText}>
          El vecino debe escanear este código para confirmar el retiro.
        </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: '#4caf50',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: '#9ccc65',
    borderRadius: 20,
    marginBottom: 30,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});