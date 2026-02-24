'use client';

import React, { useState, ReactNode, useCallback } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface AlertDialogProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: ViewStyle;
}

// Context para compartir estado entre componentes
const AlertDialogContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

export function AlertDialog({ 
  children, 
  open = false, 
  onOpenChange, 
  style 
}: AlertDialogProps) {
  const [isOpen, setIsOpen] = useState(open);

  const handleOpenChange = useCallback((value: boolean) => {
    setIsOpen(value);
    onOpenChange?.(value);
  }, [onOpenChange]);

  return (
    <AlertDialogContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
      <View style={[styles.root, style]}>
        {children}
      </View>
    </AlertDialogContext.Provider>
  );
}

export function AlertDialogTrigger({ 
  children, 
  onPress, 
  style 
}: { 
  children: ReactNode; 
  onPress?: () => void;
  style?: ViewStyle;
}) {
  const context = React.useContext(AlertDialogContext);
  
  const handlePress = () => {
    context?.setIsOpen(true);
    onPress?.();
  };

  return (
    <TouchableOpacity style={[styles.trigger, style]} onPress={handlePress}>
      {children}
    </TouchableOpacity>
  );
}

export function AlertDialogPortal({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function AlertDialogOverlay({ style }: { style?: ViewStyle }) {
  return <View style={[styles.overlay, style]} />;
}

export function AlertDialogContent({ children, style }: { 
  children: ReactNode; 
  style?: ViewStyle; 
}) {
  const context = React.useContext(AlertDialogContext);

  return (
    <Modal
      visible={context?.isOpen || false}
      transparent
      animationType="fade"
      onRequestClose={() => context?.setIsOpen(false)}
      statusBarTranslucent
    >
      <AlertDialogOverlay />
      <View style={[styles.content, style]}>
        {children}
      </View>
    </Modal>
  );
}

export function AlertDialogHeader({ children, style }: { 
  children: ReactNode; 
  style?: ViewStyle; 
}) {
  return (
    <View style={[styles.header, style]}>
      {children}
    </View>
  );
}

export function AlertDialogFooter({ children, style }: { 
  children: ReactNode; 
  style?: ViewStyle; 
}) {
  return (
    <View style={[styles.footer, style]}>
      {children}
    </View>
  );
}

export function AlertDialogTitle({ children, style }: { 
  children: ReactNode; 
  style?: TextStyle; 
}) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function AlertDialogDescription({ children, style }: { 
  children: ReactNode; 
  style?: TextStyle; 
}) {
  return <Text style={[styles.description, style]}>{children}</Text>;
}

export function AlertDialogAction({ children, onPress, style }: {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}) {
  const context = React.useContext(AlertDialogContext);
  
  return (
    <TouchableOpacity 
      style={[styles.action, style]} 
      onPress={() => {
        onPress?.();
        context?.setIsOpen(false);
      }}
    >
      <Text style={styles.actionText}>{children}</Text>
    </TouchableOpacity>
  );
}

export function AlertDialogCancel({ children, onPress, style }: {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}) {
  const context = React.useContext(AlertDialogContext);
  
  return (
    <TouchableOpacity 
      style={[styles.cancel, style]} 
      onPress={() => {
        onPress?.();
        context?.setIsOpen(false);
      }}
    >
      <Text style={styles.cancelText}>{children}</Text>
    </TouchableOpacity>
  );
}

// Mantén los mismos styles
const styles = StyleSheet.create({
  root: {},
  trigger: {},
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 8,
    maxWidth: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  action: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  actionText: {
    color: 'white',
    fontWeight: '500',
  },
  cancel: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  cancelText: {
    color: '#666',
    fontWeight: '500',
  },
});

export { AlertDialogContext };

export default function _Component() { return null; }
