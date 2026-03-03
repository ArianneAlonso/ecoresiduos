import React from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { Calendar, MapPin } from 'lucide-react-native';
import { Card } from '../../src/components/ui/card'; 
import { Button } from '../../src/components/ui/button'; 

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl?: string;
}

export default function EventCard({ title, date, location, description, imageUrl }: EventCardProps) {
  const { width } = useWindowDimensions();

  return (
    <Card style={styles.card}>
      {imageUrl && (
        <Image 
          source={{ uri: imageUrl }} 
          style={[styles.image, { width }]} 
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
        
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Calendar size={16} color="#6b7280" />
            <Text style={styles.metaText}>{date}</Text>
          </View>
          <View style={styles.metaItem}>
            <MapPin size={16} color="#6b7280" />
            <Text style={styles.metaText}>{location}</Text>
          </View>
        </View>
        
        <Button style={styles.button} testID="button-rsvp">
          Confirmar Asistencia
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    overflow: 'hidden',
    borderRadius: 12,
  },
  image: {
    height: 128,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  meta: {
    gap: 8,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#111827',
  },
  button: {
    width: '100%',
  },
});
