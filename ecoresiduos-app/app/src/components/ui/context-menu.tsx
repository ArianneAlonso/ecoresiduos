import React, { useState, useRef, ReactNode } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet,
  Dimensions 
} from 'react-native';
import { Check, Circle } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ContextMenuProps {
  children: ReactNode;
  style?: any;
}

interface ContextMenuItemProps {
  children: ReactNode;
  inset?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

const ContextMenuRoot = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showMenu = (e: any) => {
    const x = e.nativeEvent.pageX;
    const y = e.nativeEvent.pageY;
    
    setPosition({ x, y });
    setVisible(true);
    
    timeoutRef.current = setTimeout(() => setVisible(false), 5000);
  };

  const hideMenu = () => {
    setVisible(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <View style={styles.root}>
      <TouchableOpacity onLongPress={showMenu}>
        {children}
      </TouchableOpacity>

      {visible && (
        <View
          style={[
            styles.content,
            {
              left: position.x,
              top: position.y,
              maxWidth: screenWidth - position.x - 8,
              maxHeight: screenHeight - position.y - 8,
            }
          ]}
        >
          {React.Children.map(children, (child: any) =>
            React.cloneElement(child, { onClose: hideMenu })
          )}
        </View>
      )}
    </View>
  );
};

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  ContextMenuItemProps & { onClose?: () => void }
>(
  ({ children, inset = false, onPress, disabled = false, onClose }, ref) => (
    <TouchableOpacity
      ref={ref}
      style={[
        styles.item,
        inset && styles.itemInset,
        disabled && styles.itemDisabled,
      ]}
      onPress={() => {
        onPress?.();
        onClose?.();
      }}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  )
);

ContextMenuItem.displayName = 'ContextMenuItem';

const ContextMenuCheckboxItem = ({ 
  children, 
  checked = false, 
  onPress 
}: { 
  children: ReactNode; 
  checked?: boolean; 
  onPress?: () => void; 
}) => (
  <ContextMenuItem onPress={onPress}>
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Check size={14} color="white" />}
    </View>
    <Text style={styles.itemText}>{children}</Text>
  </ContextMenuItem>
);

const ContextMenuRadioItem = ({ 
  children, 
  checked = false, 
  onPress 
}: { 
  children: ReactNode; 
  checked?: boolean; 
  onPress?: () => void; 
}) => (
  <ContextMenuItem onPress={onPress}>
    <View style={[styles.radio, checked && styles.radioChecked]}>
      {checked && <Circle size={10} color="white" />}
    </View>
    <Text style={styles.itemText}>{children}</Text>
  </ContextMenuItem>
);

const ContextMenuSeparator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 8,
    minWidth: 160,
    maxWidth: 240,
    zIndex: 9999,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
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
    borderWidth: 1,
  },
  itemText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
});

export {
  ContextMenuRoot as ContextMenu,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuSeparator,
};
export default function _Component() { return null; }
