import { useState } from 'react';
import { Camera, CheckCircle2, Trash2, Wine, FileText, Cpu, Package, Leaf, MapPin, Calendar, Upload, Filter } from 'lucide-react-native';
import AppHeader from '../../src/components/AppHeader';
import MaterialCard from '../../src/components/MaterialCard';
import { Button } from '../../src/components/ui/button';
import { Card } from '../../src/components/ui/card';
import { Input } from '../../src/components/ui/input';
import { Label } from '../../src/components/ui/label';
import { Badge } from '../../src/components/ui/badge';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

const materials = [
  { id: "plastic", icon: Trash2, label: "Plástico" },
  { id: "glass", icon: Wine, label: "Vidrio" },
  { id: "paper", icon: FileText, label: "Papel" },
  { id: "metal", icon: Package, label: "Metal" },
  { id: "electronics", icon: Cpu, label: "Electrónicos" },
  { id: "organic", icon: Leaf, label: "Orgánicos" },
];

const containerTypes = {
  bolsas: [
    { id: "bolsa-supermercado", label: "Bolsa de supermercado" },
    { id: "bolsa-consorcio", label: "Bolsa de consorcio / basura" },
    { id: "bolsa-cocina", label: "Bolsa pequeña de cocina" },
    { id: "bolsa-alpillera", label: "Bolsa alpillera" },
    { id: "bolsa-malla", label: "Bolsa malla para jardín" },
  ],
  cajas: [
    { id: "caja-pequeña", label: "Caja pequeña" },
    { id: "caja-mediana", label: "Caja mediana" },
    { id: "caja-grande", label: "Caja grande" },
  ],
  bidones: [
    { id: "bidon-pequeño", label: "Bidón pequeño" },
    { id: "bidon-grande", label: "Bidón grande" },
  ],
  otros: [
    { id: "sueltos", label: "Residuos sueltos / a granel" },
    { id: "rollos", label: "Rollos o fardos" },
  ],
};

export default function PickupRequest() {
  const [step, setStep] = useState(1);
  const [scanMethod, setScanMethod] = useState<"scan" | "manual" | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedContainer, setSelectedContainer] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [address, setAddress] = useState("");

  const scheduleOptions = [
    { id: "lunes-mañana", day: "Lunes", time: "Mañana", hours: "8:00 - 12:00" },
    { id: "martes-tarde", day: "Martes", time: "Tarde", hours: "14:00 - 18:00" },
    { id: "miercoles-mañana", day: "Miércoles", time: "Mañana", hours: "8:00 - 12:00" },
    { id: "jueves-tarde", day: "Jueves", time: "Tarde", hours: "14:00 - 18:00" },
  ];

  const toggleMaterial = (id: string) => {
    setSelectedMaterials(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleImageUpload = () => {
    // Simular selección de imagen desde galería
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
    console.log('Solicitud enviada:', { selectedMaterials, selectedContainer, address, selectedSchedule });
    setStep(1);
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
      <AppHeader title="Solicitar Retiro" showBack />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.progressBar}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.progressStep,
                s <= step && styles.progressStepActive
              ]}
            />
          ))}
        </View>

        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Reconocimiento de materiales</Text>
            <Text style={styles.stepDescription}>Escanea tus residuos o selecciónalos manualmente</Text>

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
                    <Text style={styles.methodTitle}>Escanear con cámara</Text>
                    <Text style={styles.methodDesc}>Usa IA para identificar automáticamente tus materiales</Text>
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
                    <Text style={styles.methodTitle}>Selección manual</Text>
                    <Text style={styles.methodDesc}>Elige tú mismo los tipos de materiales</Text>
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
                  Cambiar método
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
                  Cambiar método
                </Button>
              </View>
            )}
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Tipo de envase</Text>
            <Text style={styles.stepDescription}>¿En qué tipo de contenedor están tus residuos?</Text>

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
                          selectedContainer === container.id && styles.containerCardSelected
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
                <Text style={styles.summaryValue}>
                  {selectedMaterials.map(getMaterialLabel).join(", ")}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Envase:</Text>
                <Text style={styles.summaryValue}>{getContainerLabel()}</Text>
              </View>
            </Card>

            <View style={styles.mapPlaceholder}>
              <MapPin size={48} color="#6b7280" />
              <Text style={styles.mapPlaceholderText}>Detectar ubicación</Text>
            </View>

            <View style={styles.inputGroup}>
              <Label>Dirección de retiro</Label>
              <Input
                placeholder="Ej: Av. Principal 123, Depto 4B"
                value={address}
                onChangeText={setAddress}
                testID="input-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Label>Selecciona día y horario</Label>
              <View style={styles.scheduleGrid}>
                {scheduleOptions.map((schedule) => (
                  <TouchableOpacity
                    key={schedule.id}
                    style={[
                      styles.scheduleCard,
                      selectedSchedule === schedule.id && styles.scheduleCardSelected
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
                      {selectedSchedule === schedule.id && (
                        <CheckCircle2 size={20} color="#1f5c2e" />
                      )}
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
            Atrás
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
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 16, paddingBottom: 120 },
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
  progressStepActive: { backgroundColor: '#1f5c2e' },
  stepContainer: { gap: 16 },
  stepTitle: { fontSize: 20, fontWeight: '600', color: '#111827' },
  stepDescription: { fontSize: 16, color: '#6b7280' },
  methodCards: { gap: 12 },
  methodCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodIconSecondary: { backgroundColor: '#f3f4f6' },
  methodTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  methodDesc: { fontSize: 14, color: '#6b7280' },
  scanSection: { gap: 16 },
  uploadCard: { padding: 20 },
  uploadArea: {
    height: 192,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  uploadText: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
  imagePreviewContainer: { position: 'relative' },
  imagePreview: { width: '100%', height: 192, borderRadius: 12 },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  analyzingText: { color: '#fff', marginTop: 12, fontSize: 16 },
  materialsIdentified: { marginTop: 16 },
  materialsTitle: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  badgesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 4 },
  materialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  containerGroups: { gap: 20 },
  containerGroup: {},
  groupTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  containerList: { gap: 8 },
  containerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  containerCardSelected: {
    borderColor: '#1f5c2e',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1f5c2e',
  },
  containerLabel: { fontSize: 16, flex: 1 },
  summaryCard: { padding: 16 },
  summaryTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: '#6b7280' },
  summaryValue: { fontWeight: '500' },
  mapPlaceholder: {
    height: 192,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: { marginTop: 8, color: '#6b7280' },
  inputGroup: { gap: 8 },
  scheduleGrid: { gap: 12 },
  scheduleCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  scheduleCardSelected: {
    borderColor: '#1f5c2e',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  scheduleHeader: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  scheduleDay: { fontSize: 16, fontWeight: '600' },
  scheduleHours: { fontSize: 14, color: '#6b7280' },
  changeMethodButton: { marginTop: 8 },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: { flex: 1 },
  nextButton: { flex: 1 },
});
