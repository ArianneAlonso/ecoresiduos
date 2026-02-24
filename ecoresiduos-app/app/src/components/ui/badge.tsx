'use client';

import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Variant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps {
  variant?: Variant;
  className?: string;
  style?: any;
  children: ReactNode;
}

const Badge = ({ 
  variant = 'default', 
  className, 
  style, 
  children, 
  ...props 
}: BadgeProps) => {
  const baseStyle = [
    styles.base,
    variantStyles[variant],
    style,
  ];

  return (
    <View style={baseStyle} {...props}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    minHeight: 20,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

const variantStyles: Record<Variant, any> = {
  default: {
    backgroundColor: '#1f5c2e',
  },
  secondary: {
    backgroundColor: '#6b7280',
  },
  destructive: {
    backgroundColor: '#ef4444',
  },
  outline: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'transparent',
  },
};

export { Badge };
export type { BadgeProps };

export default function _Component() { return null; }
