'use client';

import React, { createContext, useContext, Children, useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ToggleGroupContextValue {
  variant?: 'default';
  size?: 'default' | 'sm' | 'lg';
  pressedValues: string[];
  onPressedChange: (value: string[]) => void;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

interface ToggleGroupProps {
  type?: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  variant?: 'default';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
  style?: any;
}

function ToggleGroup({
  type = 'single',
  value: controlledValue,
  defaultValue,
  onValueChange,
  variant = 'default',
  size = 'default',
  children,
  style,
}: ToggleGroupProps) {
  const [internalValue, setInternalValue] = useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []
  );
  
  const value = controlledValue 
    ? (Array.isArray(controlledValue) ? controlledValue : [controlledValue])
    : internalValue;

  const handleValueChange = useCallback((newValue: string[]) => {
    const finalValue = type === 'single' ? newValue.slice(0, 1) : newValue;
    if (onValueChange) {
      onValueChange(type === 'single' ? finalValue[0] || '' : finalValue);
    } else {
      setInternalValue(finalValue);
    }
  }, [onValueChange, type]);

  const contextValue = {
    variant,
    size,
    pressedValues: value,
    onPressedChange: handleValueChange,
  };

  return (
    <View style={[styles.group, style]}>
      <ToggleGroupContext.Provider value={contextValue}>
        {children}
      </ToggleGroupContext.Provider>
    </View>
  );
}

function ToggleGroupItem({
  value,
  children,
  style,
  ...props
}: {
  value: string;
  children: React.ReactNode;
  style?: any;
} & React.ComponentProps<typeof TouchableOpacity>) {
  const context = useContext(ToggleGroupContext);
  if (!context) throw new Error('ToggleGroupItem must be used within ToggleGroup');

  const isPressed = context.pressedValues.includes(value);

  const handlePress = () => {
    const newPressedValues = isPressed
      ? context.pressedValues.filter((v) => v !== value)
      : [...context.pressedValues, value];
    
    context.onPressedChange(newPressedValues);
  };

  return (
    <TouchableOpacity
      style={[
        styles.item,
        isPressed && styles.itemPressed,
        context.size === 'sm' && styles.itemSm,
        context.size === 'lg' && styles.itemLg,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      {...props}
    >
      <Text style={[
        styles.itemText,
        isPressed && styles.itemTextPressed,
      ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: 'transparent',
  },
  itemPressed: {
    backgroundColor: '#fff',
    borderColor: '#1f5c2e',
    shadowColor: '#1f5c2e',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  itemSm: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 28,
  },
  itemLg: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    textAlign: 'center',
  },
  itemTextPressed: {
    color: '#1e40af',
    fontWeight: '600',
  },
});

export { ToggleGroup, ToggleGroupItem };

export default function _Component() { return null; }
