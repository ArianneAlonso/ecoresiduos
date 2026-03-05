import React, { useState, ReactNode } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { Check, ChevronRight, Circle } from 'lucide-react-native';

interface DropdownMenuProps {
  children: ReactNode;
}

interface DropdownMenuItemProps {
  children: ReactNode;
  inset?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

const DropdownMenu = ({ children }: DropdownMenuProps) => {
  return <View>{children}</View>;
};

const DropdownMenuTrigger = ({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setOpen(!open)}
        activeOpacity={0.7}
      >
        <View style={styles.triggerContent}>
          {label}
        </View>
        <ChevronRight size={16} color="#9ca3af" />
      </TouchableOpacity>

      {open && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  DropdownMenuItemProps
>(({ children, inset = false, onPress, disabled = false }, ref) => (
  <TouchableOpacity
    ref={ref}
    style={[
      styles.item,
      inset && styles.itemInset,
      disabled && styles.itemDisabled,
    ]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
  >
    {typeof children === 'string' ? (
      <Text style={styles.itemText}>{children}</Text>
    ) : (
      children
    )}
  </TouchableOpacity>
));

DropdownMenuItem.displayName = 'DropdownMenuItem';

const DropdownMenuCheckboxItem = ({
  children,
  checked = false,
  onPress,
}: {
  children: ReactNode;
  checked?: boolean;
  onPress?: () => void;
}) => (
  <DropdownMenuItem onPress={onPress}>
    <View style={styles.row}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Check size={14} color="white" />}
      </View>
      <Text style={styles.itemText}>{children}</Text>
    </View>
  </DropdownMenuItem>
);

const DropdownMenuRadioItem = ({
  children,
  checked = false,
  onPress,
}: {
  children: ReactNode;
  checked?: boolean;
  onPress?: () => void;
}) => (
  <DropdownMenuItem onPress={onPress}>
    <View style={styles.row}>
      <View style={[styles.radio, checked && styles.radioChecked]}>
        {checked && <Circle size={10} color="white" />}
      </View>
      <Text style={styles.itemText}>{children}</Text>
    </View>
  </DropdownMenuItem>
);

const DropdownMenuLabel = ({
  children,
  inset = false,
}: {
  children: ReactNode;
  inset?: boolean;
}) => (
  <View style={[styles.label, inset && styles.itemInset]}>
    <Text style={styles.labelText}>{children}</Text>
  </View>
);

const DropdownMenuSeparator = () => <View style={styles.separator} />;

const DropdownMenuShortcut = ({ children }: { children: ReactNode }) => (
  <Text style={styles.shortcut}>{children}</Text>
);

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'space-between',
    minWidth: 150,
  },
  triggerContent: {
    flex: 1,
  },
  content: {
    marginTop: 4,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 8,
    minWidth: 160,
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInset: {
    paddingLeft: 32,
  },
  itemDisabled: {
    opacity: 0.5,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1f5c2e',
    borderColor: '#1f5c2e',
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioChecked: {
    backgroundColor: '#1f5c2e',
    borderColor: '#1f5c2e',
  },
  itemText: {
    fontSize: 14,
    color: '#111827',
  },
  label: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  shortcut: {
    marginLeft: 'auto',
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    opacity: 0.6,
  },
});

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
};
export default function _Component() { return null; }
