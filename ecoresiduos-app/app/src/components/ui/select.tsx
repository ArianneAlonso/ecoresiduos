"use client"

import React, { useState, ReactNode } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import { Check, ChevronDown } from 'lucide-react-native';

interface SelectProps {
  children: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}

interface SelectContentProps {
  children: ReactNode;
  onClose: () => void;
  style?: any;
}

const Select = React.forwardRef<View, SelectProps>(
  ({ children, value, onValueChange, defaultValue, ...props }, ref) => {
    return (
      <View ref={ref} {...props}>
        {children}
      </View>
    );
  }
);
Select.displayName = 'Select';

const SelectTrigger = ({ 
  children, 
  value, 
  placeholder = 'Selecciona una opción...' 
}: { 
  children: ReactNode; 
  value?: string; 
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  const displayValue = value || placeholder;

  return (
    <>
      <TouchableOpacity 
        style={styles.trigger}
        onPress={() => setOpen(!open)}
        activeOpacity={0.7}
      >
        <Text style={styles.triggerText} numberOfLines={1}>
          {displayValue}
        </Text>
        <ChevronDown size={20} color="#9ca3af" />
      </TouchableOpacity>
      
      {open && (
        <SelectContent onClose={() => setOpen(false)}>
          {children}
        </SelectContent>
      )}
    </>
  );
};

const SelectContent = ({ 
  children, 
  onClose, 
  style 
}: SelectContentProps) => (
  <View style={[styles.content, style]}>
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  </View>
);

interface SelectItemProps {
  value: string;
  children: ReactNode;
  onPress?: () => void;
}

const SelectItem = ({ value, children, onPress, ...props }: SelectItemProps) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} {...props}>
      <Text style={styles.itemText}>{children}</Text>
      <Check size={20} color="#1f5c2e" style={styles.checkHidden} />
    </TouchableOpacity>
  );
};

const SelectGroup = ({ children }: { children: ReactNode }) => (
  <View style={styles.group}>{children}</View>
);

const SelectValue = ({ children }: { children: ReactNode }) => <>{children}</>;

const SelectLabel = ({ children }: { children: ReactNode }) => (
  <Text style={styles.label}>{children}</Text>
);

const SelectSeparator = () => <View style={styles.separator} />;

const SelectScrollUpButton = () => null;
const SelectScrollDownButton = () => null;

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
  },
  triggerText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  content: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    marginTop: 4,
  },
  group: {
    padding: 4,
  },
  label: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  itemText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  checkHidden: {
    opacity: 0,
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginHorizontal: -4,
  },
});

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
export default function _Component() { return null; }
