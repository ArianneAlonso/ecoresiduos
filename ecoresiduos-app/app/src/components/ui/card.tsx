'use client';

import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CardProps {
  children: ReactNode;
  style?: any;
}

const Card = React.forwardRef<View, CardProps>(
  ({ children, style, ...props }, ref) => (
    <View 
      ref={ref}
      style={[styles.card, style]} 
      {...props}
    >
      {children}
    </View>
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<View, { children: ReactNode; style?: any }>(
  ({ children, style, ...props }, ref) => (
    <View 
      ref={ref}
      style={[styles.cardHeader, style]} 
      {...props}
    >
      {children}
    </View>
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<Text, { children: ReactNode; style?: any }>(
  ({ children, style, ...props }, ref) => (
    <Text 
      ref={ref}
      style={[styles.cardTitle, style]} 
      {...props}
    >
      {children}
    </Text>
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<Text, { children: ReactNode; style?: any }>(
  ({ children, style, ...props }, ref) => (
    <Text 
      ref={ref}
      style={[styles.cardDescription, style]} 
      {...props}
    >
      {children}
    </Text>
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<View, { children: ReactNode; style?: any }>(
  ({ children, style, ...props }, ref) => (
    <View 
      ref={ref}
      style={[styles.cardContent, style]} 
      {...props}
    >
      {children}
    </View>
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<View, { children: ReactNode; style?: any }>(
  ({ children, style, ...props }, ref) => (
    <View 
      ref={ref}
      style={[styles.cardFooter, style]} 
      {...props}
    >
      {children}
    </View>
  )
);
CardFooter.displayName = 'CardFooter';

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'column',
    gap: 4,
    padding: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  cardContent: {
    padding: 24,
    paddingTop: 0,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 0,
  },
});

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};

export default function _Component() { return null; }
