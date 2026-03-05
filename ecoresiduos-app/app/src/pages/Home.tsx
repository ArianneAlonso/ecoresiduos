import { Truck, QrCode, MapPin, Leaf } from 'lucide-react-native';
import UpcomingCollection from '../../src/components/UpcomingCollection';
import { View, Text, ScrollView, StyleSheet, Image, Modal, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useCollections } from '../context/CollectionsContext';
import { useState } from 'react';

const educacionA = require('../../../images/educaciona.jpg');
const educacionB = require('../../../images/educacionb.jpg');
const educacionC = require('../../../images/educacionc.jpg');
const educacionD = require('../../../images/educaciond.jpg');
const educacionE = require('../../../images/educacione.jpg');
export default function Home() {
  const route = useRoute<any>();
  const nombreUsuario = route.params?.nombre || 'Usuario';
  const { collections } = useCollections();
  const latestCollection = collections.length > 0 ? collections[collections.length - 1] : null;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const openImage = (image: any) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeImage = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
   <ScrollView style={styles.container}>
  <View style={styles.hero}>
    <View style={styles.heroContent}>
      <Text style={styles.heroTitle}>Hola, Abril!</Text>
      <Text style={styles.heroSubtitle}>
        Juntos hacemos un planeta más verde
      </Text>
    </View>
  </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próxima Recolección</Text>
        {latestCollection ? (
          <UpcomingCollection
            date={latestCollection.selectedSchedule}
            time="8:00 AM - 12:00 PM"
            materials={latestCollection.selectedMaterials.map(m => m.charAt(0).toUpperCase() + m.slice(1))}
            daysUntil={1}
          />
        ) : (
          <Text>No hay recolecciones próximas</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Educación Ambiental</Text>
        <View style={styles.publicationsContainer}>

          <TouchableOpacity style={styles.publicationCard} onPress={() => openImage(educacionA)}>
            <Image style={styles.publicationImage} source={educacionA} />
            <Text style={styles.publicationTitle}>¿Qué Recibimos en nuestros ECOpuntos?</Text>
            <Text style={styles.publicationSubtitle}>Nuevo Evento el 27 de septiembre</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.publicationCard} onPress={() => openImage(educacionB)}>
            <Image style={styles.publicationImage} source={educacionB} />
            <Text style={styles.publicationTitle}>Visita Nuestro Programa de Responsabilidad Ambiental</Text>
            <Text style={styles.publicationSubtitle}>Tomemos conciencia</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.publicationCard} onPress={() => openImage(educacionC)}>
            <Image style={styles.publicationImage} source={educacionC} />
            <Text style={styles.publicationTitle}>Aprende separar tus residuos</Text>
            <Text style={styles.publicationSubtitle}>¿Sabiás Cuántos nudos tienes que dar a tus bolsas?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.publicationCard} onPress={() => openImage(educacionD)}>
            <Image style={styles.publicationImage} source={educacionD} />
            <Text style={styles.publicationTitle}>Tipos de residuos</Text>
            <Text style={styles.publicationSubtitle}>¿Conocés más tipos?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.publicationCard} onPress={() => openImage(educacionE)}>
            <Image style={styles.publicationImage} source={educacionE} />
            <Text style={styles.publicationTitle}>Las tres R's</Text>
            <Text style={styles.publicationSubtitle}>Y paso a paso de como compostar</Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* Modal para mostrar imagen completa */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalBackground} onPress={closeImage}>
          <Image style={styles.fullImage} source={selectedImage} />
        </TouchableOpacity>
      </Modal>

    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  hero: {
    backgroundColor: '#4CAF50',
    paddingVertical: 35,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },

  heroContent: {
    gap: 8,
  },

  heroTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  heroSubtitle: {
    fontSize: 15,
    color: '#E8F5E9',
  },

  section: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },

  publicationsContainer: {
    gap: 16,
  },

  publicationCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },

  publicationImage: {
    height: 140,
    width: '100%',
    resizeMode: 'cover',
  },

  publicationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  publicationSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },
});
