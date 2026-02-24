'use client';

import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: any;
  className?: string;
}

const Checkbox = React.forwardRef<View, CheckboxProps>(
  ({ checked = false, onCheckedChange, disabled = false, style, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = useState(checked);

    const handlePress = () => {
      if (disabled) return;
      
      const newChecked = !internalChecked;
      setInternalChecked(newChecked);
      onCheckedChange?.(newChecked);
    };

    return (
      <TouchableOpacity
        ref={ref as any}
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
          disabled && styles.checkboxDisabled,
          style,
        ]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
        {...props}
      >
        {checked && (
          <Check 
            size={16} 
            color="white" 
            style={styles.checkIcon} 
          />
        )}
      </TouchableOpacity>
    );
  }
);

Checkbox.displayName = 'Checkbox';

const styles = StyleSheet.create({
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1f5c2e',
    borderColor: '#1f5c2e',
  },
  checkboxDisabled: {
    opacity: 0.5,
    borderColor: '#d1d5db',
  },
  checkIcon: {
    marginTop: -1,
  },
});

export { Checkbox };

export default function _Component() { return null; }
