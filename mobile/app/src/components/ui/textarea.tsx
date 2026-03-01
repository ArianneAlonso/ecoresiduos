'use client';

import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

interface TextareaProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: any;
  multiline?: boolean;
  numberOfLines?: number;
  placeholderTextColor?: string;
}

function Textarea({
  value,
  onChangeText,
  placeholder,
  disabled = false,
  style,
  multiline = true,
  numberOfLines = 4,
  placeholderTextColor = '#9ca3af',
  ...props
}: TextareaProps) {
  return (
    <View style={[styles.wrapper, style]}>
      <TextInput
        style={[
          styles.textarea,
          disabled && styles.disabled,
          multiline && { minHeight: 80 },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        editable={!disabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        scrollEnabled={true}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  textarea: {
    minHeight: 80,
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#111827',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: '#f9fafb',
  },
});

export { Textarea };

export default function _Component() { return null; }
