import React, { useState } from 'react';
import { Leaf, Trash2, Recycle, Package, AlertCircle, Lightbulb, BookOpen } from 'lucide-react-native';
import AppHeader from '../../src/components/AppHeader';
import { Card } from '../../src/components/ui/card';
import { Badge } from '../../src/components/ui/badge';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const tips = [
  "Separa tus residuos desde el origen para facilitar el reciclaje",
  "Lava los envases antes de reciclarlos",
  "Reduce el uso de plásticos de un solo uso",
  "Reutiliza bolsas y contenedores cuando sea posible",
  "Composta tus residuos orgánicos en casa",
];

const wasteTypes = [
  {
    title: "Residuos Orgánicos",
    icon: Leaf,
    color: "#16a34a",
    bgColor: "#dcfce7",
    description: "Restos de comida, cáscaras, residuos de jardín",
    examples: ["Frutas y verduras", "Restos de café y té", "Cáscaras de huevo", "Hojas y ramas"],
  },
  {
    title: "Residuos Inorgánicos",
    icon: Package,
    color: "#2563eb",
    bgColor: "#dbeafe",
    description: "Plásticos, vidrio, metales, papel y cartón",
    examples: ["Botellas plásticas", "Latas de aluminio", "Papel y cartón", "Vidrio"],
  },
  {
    title: "Residuos Sanitarios",
    icon: AlertCircle,
    color: "#dc2626",
    bgColor: "#fee2e2",
    description: "Pañales, toallas sanitarias, materiales médicos",
    examples: ["Pañales desechables", "Toallas sanitarias", "Gasas y vendajes", "Mascarillas usadas"],
  },
];

const containers = [
  {
    name: "Contenedor Verde",
    materials: ["Plástico", "Vidrio", "Papel", "Cartón"],
    color: "#1f5c2e",
  },
  {
    name: "Contenedor Marrón",
    materials: ["Residuos orgánicos", "Restos de comida"],
    color: "#d97706",
  },
  {
    name: "Contenedor Gris",
    materials: ["Residuos sanitarios", "No reciclables"],
    color: "#6b7280",
  },
];

const threeRs = [
  {
    title: "Reducir",
    icon: Lightbulb,
    description: "Minimiza la cantidad de residuos que generas",
    tips: [
      "Compra productos con menos empaque",
      "Evita productos desechables",
      "Planifica tus compras para evitar desperdicios",
      "Usa bolsas reutilizables",
    ],
  },
  {
    title: "Reutilizar",
    icon: Recycle,
    description: "Dale una segunda vida a los objetos",
    tips: [
      "Usa frascos de vidrio para almacenar",
      "Repara objetos en lugar de desecharlos",
      "Dona lo que ya no uses",
      "Convierte ropa vieja en trapos de limpieza",
    ],
  },
  {
    title: "Reciclar",
    icon: Trash2,
    description: "Transforma los residuos en nuevos productos",
    tips: [
      "Separa correctamente tus residuos",
      "Limpia los envases antes de reciclar",
      "Aplasta las botellas para ahorrar espacio",
      "Consulta qué materiales se reciclan en tu zona",
    ],
  },
];

const compostSteps = [
  {
    step: "1",
    title: "Elige el contenedor",
    description: "Usa un contenedor con tapa, puede ser comercial o casero, con agujeros para ventilación",
  },
  {
    step: "2",
    title: "Agrega materiales verdes",
    description: "Restos de frutas, verduras, café, té y cáscaras de huevo (ricos en nitrógeno)",
  },
  {
    step: "3",
    title: "Agrega materiales marrones",
    description: "Hojas secas, ramas pequeñas, papel sin tinta (ricos en carbono)",
  },
  {
    step: "4",
    title: "Mantén la humedad",
    description: "El compost debe estar húmedo como una esponja exprimida, no empapado",
  },
  {
    step: "5",
    title: "Mezcla regularmente",
    description: "Revuelve cada 1-2 semanas para oxigenar y acelerar la descomposición",
  },
  {
    step: "6",
    title: "Espera y cosecha",
    description: "En 2-6 meses tendrás compost listo, oscuro y con olor a tierra",
  },
];

export default function Tips() {
  const [expandedRs, setExpandedRs] = useState<number | null>(null);

  const toggleRs = (index: number) => {
    setExpandedRs(expandedRs === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Consejos Ecológicos" showBack />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Tips */}
        <Card style={styles.quickTipsCard}>
          <View style={styles.quickTipsHeader}>
            <View style={styles.iconCircle}>
              <Lightbulb size={24} color="#1f5c2e" />
            </View>
            <View style={styles.quickTipsContent}>
              <Text style={styles.sectionTitle}>Consejos Rápidos</Text>
              {tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        </Card>

        {/* Waste Types */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Trash2 size={20} color="#1f5c2e" />
            <Text style={styles.sectionTitle}>Tipos de Residuos</Text>
          </View>
          {wasteTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <Card key={index} style={styles.wasteCard}>
                <View style={styles.wasteHeader}>
                  <View style={[styles.wasteIcon, { backgroundColor: type.bgColor }]}>
                    <Icon size={24} color={type.color} />
                  </View>
                  <View style={styles.wasteContent}>
                    <Text style={styles.wasteTitle}>{type.title}</Text>
                    <Text style={styles.wasteDescription}>{type.description}</Text>
                    <View style={styles.examplesContainer}>
                      {type.examples.map((example, exIndex) => (
                        <Badge key={exIndex} variant="secondary" style={styles.exampleBadge}>
                          {example}
                        </Badge>
                      ))}
                    </View>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>

        {/* Containers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Package size={20} color="#1f5c2e" />
            <Text style={styles.sectionTitle}>Tipos de Contenedores</Text>
          </View>
          {containers.map((container, index) => (
            <Card key={index} style={styles.containerCard}>
              <View style={styles.containerHeader}>
                <View style={[styles.containerDot, { backgroundColor: container.color }]} />
                <View style={styles.containerContent}>
                  <Text style={styles.containerTitle}>{container.name}</Text>
                  <View style={styles.materialsContainer}>
                    {container.materials.map((material, matIndex) => (
                      <Badge key={matIndex} variant="outline" style={styles.materialBadge}>
                        {material}
                      </Badge>
                    ))}
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* 3 Rs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Recycle size={20} color="#1f5c2e" />
            <Text style={styles.sectionTitle}>Las 3 Rs del Reciclaje</Text>
          </View>
          {threeRs.map((r, index) => {
            const Icon = r.icon;
            return (
              <TouchableOpacity
                key={index}
                style={styles.threeRItem}
                onPress={() => toggleRs(index)}
              >
                <View style={styles.threeRHeader}>
                  <View style={styles.threeRIcon}>
                    <Icon size={20} color="#1f5c2e" />
                  </View>
                  <View style={styles.threeRContent}>
                    <Text style={styles.threeRTitle}>{r.title}</Text>
                    <Text style={styles.threeRDescription}>{r.description}</Text>
                  </View>
                  <Text style={[
                    styles.chevron,
                    expandedRs === index && styles.chevronRotated
                  ]}>▼</Text>
                </View>
                {expandedRs === index && (
                  <View style={styles.threeRTips}>
                    {r.tips.map((tip, tipIndex) => (
                      <View key={tipIndex} style={styles.tipItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.tipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Compost */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Leaf size={20} color="#1f5c2e" />
            <Text style={styles.sectionTitle}>Cómo Hacer Compost en Casa</Text>
          </View>
          <Card style={styles.compostCard}>
            <Text style={styles.introText}>
              El compostaje es una forma natural de reciclar residuos orgánicos y crear abono rico en nutrientes para tus plantas.
            </Text>
            {compostSteps.map((item, index) => (
              <View key={index} style={styles.compostStep}>
                <View style={styles.stepNumber}>{item.step}</View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{item.title}</Text>
                  <Text style={styles.stepDescription}>{item.description}</Text>
                </View>
              </View>
            ))}
          </Card>
        </View>

        {/* Impact */}
        <Card style={styles.impactCard}>
          <View style={styles.impactHeader}>
            <BookOpen size={24} color="#1f5c2e" />
            <View style={styles.impactContent}>
              <Text style={styles.impactTitle}>Impacto Ambiental</Text>
              <Text style={styles.impactIntro}>
                Reciclar correctamente puede marcar una gran diferencia en nuestro planeta:
              </Text>
              {[
                "Reduce la contaminación del aire y agua",
                "Ahorra energía y recursos naturales",
                "Disminuye los residuos en vertederos",
                "Ayuda a combatir el cambio climático",
              ].map((impact, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.tipText}>{impact}</Text>
                </View>
              ))}
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  content: { 
    flex: 1, 
    padding: 16, 
    paddingBottom: 100 
  },
  quickTipsCard: { 
    padding: 24, 
    marginBottom: 24 
  },
  quickTipsHeader: { 
    flexDirection: 'row', 
    gap: 12 
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickTipsContent: { 
    flex: 1 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#111827' 
  },
  tipItem: { 
    flexDirection: 'row', 
    gap: 8, 
    marginBottom: 8 
  },
  bullet: { 
    color: '#1f5c2e', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginTop: 2 
  },
  tipText: { 
    fontSize: 14, 
    color: '#374151', 
    flex: 1 
  },
  section: { 
    gap: 16, 
    marginBottom: 24 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    marginBottom: 12 
  },
  wasteCard: { 
    padding: 16 
  },
  wasteHeader: { 
    flexDirection: 'row', 
    gap: 12 
  },
  wasteIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wasteContent: { 
    flex: 1 
  },
  wasteTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 4 
  },
  wasteDescription: { 
    fontSize: 14, 
    color: '#6b7280', 
    marginBottom: 8 
  },
  examplesContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 4 
  },
  exampleBadge: { 
    paddingHorizontal: 8, 
    paddingVertical: 4 
  },
  containerCard: { 
    padding: 16 
  },
  containerHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  containerDot: { 
    width: 16, 
    height: 16, 
    borderRadius: 8 
  },
  containerContent: { 
    flex: 1 
  },
  containerTitle: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  materialsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 4, 
    marginTop: 8 
  },
  materialBadge: { 
    paddingHorizontal: 8, 
    paddingVertical: 4 
  },
  threeRItem: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    overflow: 'hidden', 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  threeRHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  threeRIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  threeRContent: { 
    flex: 1 
  },
  threeRTitle: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  threeRDescription: { 
    fontSize: 14, 
    color: '#6b7280', 
    marginTop: 2 
  },
  chevron: { 
    fontSize: 18, 
    color: '#6b7280' 
  },
  chevronRotated: { 
    transform: [{ rotate: '-90deg' }] 
  },
  threeRTips: { 
    paddingHorizontal: 16, 
    paddingBottom: 16, 
    backgroundColor: '#f8fafc' 
  },
  compostCard: { 
    padding: 24 
  },
  introText: { 
    fontSize: 14, 
    color: '#6b7280', 
    marginBottom: 16 
  },
  compostStep: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 16, 
    alignItems: 'flex-start' 
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1f5c2e',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepContent: { 
    flex: 1 
  },
  stepTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 4 
  },
  stepDescription: { 
    fontSize: 14, 
    color: '#6b7280' 
  },
  impactCard: { 
    padding: 24 
  },
  impactHeader: { 
    flexDirection: 'row', 
    gap: 12 
  },
  impactContent: { 
    flex: 1 
  },
  impactTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 8 
  },
  impactIntro: { 
    fontSize: 14, 
    color: '#6b7280', 
    marginBottom: 12 
  },
});
