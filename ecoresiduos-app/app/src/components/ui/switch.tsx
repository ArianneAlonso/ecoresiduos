'use client';

import React from 'react';
import { Switch as NativeSwitch, StyleSheet, View } from 'react-native';
import { useColorScheme } from 'react-native';

interface SwitchProps {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  trackColor?: {
    false?: string;
    true?: string;
  };
  thumbColor?: {
    false?: string;
    true?: string;
  };
  style?: any;
}

function Switch({
  value = false,
  onValueChange,
  disabled = false,
  trackColor = {
    false: '#e5e7eb',
    true: '#1f5c2e',
  },
  thumbColor = {
    false: '#f3f4f6',
    true: '#ffffff',
  },
  style,
}: SwitchProps) {
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.root, style]}>
      <NativeSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: trackColor.false || (colorScheme === 'dark' ? '#374151' : '#e5e7eb'),
          true: trackColor.true || '#1f5c2e',
        }}
        thumbColor={
          value 
            ? (thumbColor.true || '#ffffff')
            : (thumbColor.false || (colorScheme === 'dark' ? '#9ca3af' : '#f3f4f6'))
        }
        style={styles.switch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 24,
    width: 44,
    padding: 2,
  },
  switch: {
    height: 20,
    width: 40,
  },
});

export { Switch };

export default function _Component() { return null; }
