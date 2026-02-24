'use client';

import React, { useState, useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface ToggleProps {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
  style?: any;
  className?: string;
}

function Toggle({
  pressed: controlledPressed,
  onPressedChange,
  variant = 'default',
  size = 'default',
  children,
  style,
}: ToggleProps) {
  const [internalPressed, setInternalPressed] = useState(false);
  const isPressed = controlledPressed !== undefined ? controlledPressed : internalPressed;

  const handlePress = useCallback(() => {
    const newPressed = !isPressed;
    if (onPressedChange) {
      onPressedChange(newPressed);
    } else {
      setInternalPressed(newPressed);
    }
  }, [isPressed, onPressedChange]);

  return (
    <TouchableOpacity
      style={[
        styles.root,
        variant === 'outline' && styles.outline,
        size === 'sm' && styles.sm,
        size === 'lg' && styles.lg,
        isPressed && styles.pressed,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="switch"
      accessibilityState={{ checked: isPressed }}
    >
      <Text style={[
        styles.text,
        isPressed && styles.textPressed,
      ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 40,
    height: 40,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  outline: {
    borderColor: '#d1d5db',
    backgroundColor: 'transparent',
  },
  pressed: {
    backgroundColor: '#e0e7ff',
    borderColor: '#1f5c2e',
  },
  sm: {
    height: 36,
    paddingHorizontal: 10,
    minWidth: 36,
  },
  lg: {
    height: 44,
    paddingHorizontal: 20,
    minWidth: 44,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    lineHeight: 20,
  },
  textPressed: {
    color: '#1e40af',
    fontWeight: '600',
  },
});

export { Toggle };
export default function _Component() { return null; }
