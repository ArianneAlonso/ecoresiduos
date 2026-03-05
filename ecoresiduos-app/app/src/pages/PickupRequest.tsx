import { useState } from 'react';
import { Camera, CheckCircle2, Trash2, Wine, FileText, Cpu, Package, Leaf, Calendar, Upload } from 'lucide-react-native';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCard from '../../src/components/MaterialCard';
import { Button } from '../../src/components/ui/button';
import { Card } from '../../src/components/ui/card';
import { Input } from '../../src/components/ui/input';
import { Label } from '../../src/components/ui/label';
import { Badge } from '../../src/components/ui/badge';
import { useCollections } from '../context/CollectionsContext';

const materials = [
  { id: "plastic", icon: Trash2, label: "Plastico" },
  { id: "glass", icon: Wine, label: "Vidrio" },
  { id: "paper", icon: FileText, label: "Papel" },
  { id: "metal", icon: Package, label: "Metal" },
  { id: "electronics", icon: Cpu, label: "Electronicos" },
  { id: "organic", icon: Leaf, label: "Organicos" },
];

const containerTypes = {
  bolsas: [
    { id: "bolsa-supermercado", label: "Bolsa de supermercado" },
    { id: "bolsa-consorcio", label: "Bolsa de consorcio / basura" },
    { id: "bolsa-cocina", label: "Bolsa pequeña de cocina" },
    { id: "bolsa-alpillera", label: "Bolsa alpillera" },
    { id: "bolsa-malla", label: "Bolsa malla para jardin" },
  ],
  cajas: [
    { id: "caja-pequeña", label: "Caja pequeña" },
    { id: "caja-mediana", label: "Caja mediana" },
    { id: "caja-grande", label: "Caja grande" },
  ],
  bidones: [
    { id: "bidon-pequeño", label: "Bidon pequeño" },
    { id: "bidon-grande", label: "Bidon grande" },
  ],
  otros: [
    { id: "sueltos", label: "Residuos sueltos / a granel" },
    { id: "rollos", label: "Rollos o fardos" },
  ],
};

export default function PickupRequest() {
  const navigation = useNavigation();
  const { addCollection } = useCollections();
  const [step, setStep] = useState(1);
  const [scanMethod, setScanMethod] = useState<"scan" | "manual" | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedContainer, setSelectedContainer] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [address, setAddress] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const scheduleOptions = [
    { id: "lunes-mañana", day: "Lunes", time: "Mañana", hours: "8:00 - 12:00" },
    { id: "martes-tarde", day: "Martes", time: "Tarde", hours: "14:00 - 18:00" },
    { id: "miercoles-mañana", day: "Miercoles", time: "Mañana", hours: "8:00 - 12:00" },
    { id: "viernes-tarde", day: "Viernes", time: "Tarde", hours: "14:00 - 18:00" },
  ];

  const toggleMaterial = (id: string) => {
    setSelectedMaterials(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleImageUpload = () => {
    setImagePreview('https://via.placeholder.com/300x200/3b82f6/ffffff?text=Residuos');
    setIsAnalyzing(true);
    setTimeout(() => {
      setSelectedMaterials(["plastic", "paper", "metal"]);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleNext = () => {
    if (step === 1 && selectedMaterials.length === 0) return;
    if (step === 2 && !selectedContainer) return;
    if (step < 3) setStep(step + 1);
  };

  const handleSubmit = () => {
    addCollection({ selectedMaterials, selectedContainer, address, selectedSchedule });
    setStep(1);
    setScanMethod(null);
    setSelectedMaterials([]);
    setSelectedContainer('');
    setSelectedSchedule('');
    setAddress('');
    setImagePreview(null);
    setToastMessage('Su solicitud ha sido registrada!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getMaterialLabel = (id: string) => materials.find(m => m.id === id)?.label;

  const getContainerLabel = () => {
    for (const type in containerTypes) {
      const container = (containerTypes as any)[type].find((c: any) => c.id === selectedContainer);
      if (container) return container.label;
    }
    return '';
  };

  return (
    <View style={styles.container}>
      {toastMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      <View style={styles.hero}>
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Solicitar Retiro</Text>
          <Text style={styles.heroSubtitle}>Programa el retiro de tus reciclables</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.progressBar}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={[styles.progressStep, s <= step && styles.progressStepActive]} />
          ))}
        </View>

        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Reconocimiento de materiales</Text>
            <Text style={styles.stepDescription}>Escanea tus residuos o seleccionalos manualmente</Text>

            {!scanMethod ? (
              <View style={styles.methodCards}>
                <TouchableOpacity
                  style={styles.methodCard}
                  onPress={() => setScanMethod("scan")}
                  testID="card-scan-option"
                >
                  <View style={styles.methodIcon}>
                    <Camera size={24} color="#1f5c2e" />
                  </View>
                  <View>
                    <Text style={styles.methodTitle}>Escanear con camara</Text>
                    <Text style={styles.methodDesc}>Usa IA para identificar tus materiales</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.methodCard}
                  onPress={() => setScanMethod("manual")}
                  testID="card-manual-option"
                >
                  <View style={[styles.methodIcon, styles.methodIconSecondary]}>
                    <CheckCircle2 size={24} color="#6b7280" />
                  </View>
                  <View>
                    <Text style={styles.methodTitle}>Seleccion manual</Text>
                    <Text style={styles.methodDesc}>Elige tu mismo los tipos de materiales</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : scanMethod === "scan" ? (
              <View style={styles.scanSection}>
                <Card style={styles.uploadCard}>
                  {!imagePreview ? (
                    <TouchableOpacity
                      style={styles.uploadArea}
                      onPress={handleImageUpload}
                      testID="label-upload-image"
                    >
                      <Upload size={48} color="#6b7280" />
                      <Text style={styles.uploadText}>Toca para tomar foto o subir imagen</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.imagePreviewContainer}>
                      <Image source={{ uri: imagePreview }} style={styles.imagePreview} />
                      {isAnalyzing && (
                        <View style={styles.analyzingOverlay}>
                          <ActivityIndicator size="large" color="#fff" />
                          <Text style={styles.analyzingText}>Analizando materiales...</Text>
                        </View>
                      )}
                    </View>
                  )}
                  {selectedMaterials.length > 0 && !isAnalyzing && (
                    <View style={styles.materialsIdentified}>
                      <Text style={styles.materialsTitle}>Materiales identificados:</Text>
                      <View style={styles.badgesContainer}>
                        {selectedMaterials.map((id) => (
                          <Badge key={id} variant="secondary" style={styles.badge}>
                            {getMaterialLabel(id)}
                          </Badge>
                        ))}
                      </View>
                    </View>
                  )}
                </Card>
                <Button
                  variant="outline"
                  onPress={() => {
                    setScanMethod(null);
                    setImagePreview(null);
                    setSelectedMaterials([]);
                  }}
                  style={styles.changeMethodButton}
                  testID="button-change-method"
                >
                  Cambiar metodo
                </Button>
              </View>
            ) : (
              <View>
                <View style={styles.materialsGrid}>
                  {materials.map((material) => (
                    <MaterialCard
                      key={material.id}
                      icon={material.icon}
                      label={material.label}
                      selected={selectedMaterials.includes(material.id)}
                      onPress={() => toggleMaterial(material.id)}
                    />
                  ))}
                </View>
                <Button
                  variant="outline"
                  onPress={() => {
                    setScanMethod(null);
                    setSelectedMaterials([]);
                  }}
                  style={styles.changeMethodButton}
                  testID="button-change-method"
                >
                  Cambiar metodo
                </Button>
              </View>
            )}
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Tipo de envase</Text>
            <Text style={styles.stepDescription}>En que tipo de contenedor estan tus residuos?</Text>
            <View style={styles.containerGroups}>
              {Object.entries(containerTypes).map(([type, containers]: [string, any]) => (
                <View key={type} style={styles.containerGroup}>
                  <Text style={styles.groupTitle}>
                    <Package size={16} color="#1f5c2e" /> {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                  <View style={styles.containerList}>
                    {containers.map((container: any) => (
                      <TouchableOpacity
                        key={container.id}
                        style={[
                          styles.containerCard,
                          selectedContainer === container.id && styles.containerCardSelected,
                        ]}
                        onPress={() => setSelectedContainer(container.id)}
                        testID={`card-container-${container.id}`}
                      >
                        <View style={styles.radioCircle}>
                          {selectedContainer === container.id && <View style={styles.radioDot} />}
                        </View>
                        <Text style={styles.containerLabel}>{container.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Confirmar retiro</Text>
            <Text style={styles.stepDescription}>Verifica los detalles y confirma tu solicitud</Text>

            <Card style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Resumen</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Materiales:</Text>
                <Text style={styles.summaryValue}>{selectedMaterials.map(getMaterialLabel).join(", ")}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Envase:</Text>
                <Text style={styles.summaryValue}>{getContainerLabel()}</Text>
              </View>
            </Card>

            <View style={styles.inputGroup}>
              <Label>Direccion de retiro</Label>
              <Input
                placeholder="Ej: Av. Principal 123, Depto 4B"
                value={address}
                onChangeText={setAddress}
                testID="input-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Label>Selecciona dia y horario</Label>
              <View style={styles.scheduleGrid}>
                {scheduleOptions.map((schedule) => (
                  <TouchableOpacity
                    key={schedule.id}
                    style={[
                      styles.scheduleCard,
                      selectedSchedule === schedule.id && styles.scheduleCardSelected,
                    ]}
                    onPress={() => setSelectedSchedule(schedule.id)}
                    testID={`card-schedule-${schedule.id}`}
                  >
                    <View style={styles.scheduleHeader}>
                      <Calendar size={20} color="#1f5c2e" />
                      <View>
                        <Text style={styles.scheduleDay}>{schedule.day} - {schedule.time}</Text>
                        <Text style={styles.scheduleHours}>{schedule.hours}</Text>
                      </View>
                      {selectedSchedule === schedule.id && <CheckCircle2 size={20} color="#1f5c2e" />}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomActions}>
        {step > 1 && (
          <Button
            variant="outline"
            onPress={() => setStep(step - 1)}
            style={styles.backButton}
            testID="button-back-step"
          >
            Atras
          </Button>
        )}
        <Button
          onPress={step === 3 ? handleSubmit : handleNext}
          style={styles.nextButton}
          disabled={step === 1 && !scanMethod}
          testID={step === 3 ? "button-submit" : "button-next"}
        >
          {step === 3 ? "Confirmar Solicitud" : "Continuar"}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  hero: {
    backgroundColor: "#4CAF50",
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  backIcon: {
    position: "absolute",
    top: 55,
    left: 20,
    zIndex: 10,
  },
  heroContent: {
    marginTop: 10,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#E8F5E9",
    marginTop: 6,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 120,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  progressStep: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e5e7eb',
  },
  progressStepActive: {
    backgroundColor: '#4caf50',
  },
  stepContainer: {
    gap: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f5c2e',
  },
  stepDescription: {
    fontSize: 16,
    color: '#333',
  },
  methodCards: {
    gap: 12,
  },
  methodCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodIconSecondary: {
    backgroundColor: '#f1f8e9',
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1f5c2e',
  },
  methodDesc: {
    fontSize: 14,
    color: '#555',
  },
  scanSection: {
    gap: 16,
  },
  uploadCard: {
    padding: 20,
  },
  uploadArea: {
    height: 192,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#a5d6a7',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  imagePreviewContainer: {
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 192,
    borderRadius: 12,
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  analyzingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
  materialsIdentified: {
    marginTop: 16,
  },
  materialsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#1f5c2e',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#9ccc65',
    color: '#fff',
  },
  materialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  containerGroups: {
    gap: 20,
  },
  containerGroup: {},
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1f5c2e',
  },
  containerList: {
    gap: 8,
  },
  containerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c8e6c9',
    backgroundColor: '#fff',
  },
  containerCardSelected: {
    borderColor: '#4caf50',
    backgroundColor: 'rgba(156,204,101,0.2)',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#c8e6c9',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4caf50',
  },
  containerLabel: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  summaryCard: {
    padding: 16,
    backgroundColor: '#f1f8e9',
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1f5c2e',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#555',
  },
  summaryValue: {
    fontWeight: '500',
    color: '#1f5c2e',
  },
  inputGroup: {
    gap: 8,
  },
  scheduleGrid: {
    gap: 12,
  },
  scheduleCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c8e6c9',
    backgroundColor: '#fff',
  },
  scheduleCardSelected: {
    borderColor: '#4caf50',
    backgroundColor: 'rgba(156,204,101,0.2)',
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  scheduleDay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f5c2e',
  },
  scheduleHours: {
    fontSize: 14,
    color: '#555',
  },
  changeMethodButton: {
    marginTop: 8,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
  toast: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#4caf50',
    zIndex: 999,
    alignItems: 'center',
  },
  toastText: {
    color: '#fff',
    fontWeight: '600',
  },
});