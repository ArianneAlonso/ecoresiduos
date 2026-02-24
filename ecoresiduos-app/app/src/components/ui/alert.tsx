'use client';

import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface AlertProps {
  variant?: 'default' | 'destructive';
  className?: string;
  style?: ViewStyle;
  children: ReactNode;
}

interface AlertTitleProps {
  className?: string;
  style?: TextStyle;
  children: ReactNode;
}

interface AlertDescriptionProps {
  className?: string;
  style?: TextStyle;
  children: ReactNode;
}

const Alert = React.forwardRef<View, AlertProps>(
  ({ variant = 'default', className, style, children, ...props }, ref) => {
    const baseStyle = [
      styles.alert,
      variant === 'destructive' && styles.destructive,
      style,
    ];

    return (
      <View ref={ref} style={baseStyle} role="alert" {...props}>
        {children}
      </View>
    );
  }
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<Text, AlertTitleProps>(
  ({ className, style, children, ...props }, ref) => (
    <Text ref={ref} style={[styles.title, style]} {...props}>
      {children}
    </Text>
  )
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<Text, AlertDescriptionProps>(
  ({ className, style, children, ...props }, ref) => (
    <Text ref={ref} style={[styles.description, style]} {...props}>
      {children}
    </Text>
  )
);
AlertDescription.displayName = 'AlertDescription';

const styles = StyleSheet.create({
  alert: {
    position: 'relative',
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 16,
  },
  destructive: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  title: {
    marginBottom: 4,
    fontWeight: '600',
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export { Alert, AlertTitle, AlertDescription };

export default function _Component() { return null; }
