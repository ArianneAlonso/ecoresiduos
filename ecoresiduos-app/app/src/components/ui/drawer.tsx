'use client';

import React, { ReactNode } from 'react';
import { 
  View, 
  Modal, 
  TouchableOpacity, 
  Text, 
  StyleSheet,
  Dimensions 
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

interface DrawerProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DrawerContentProps {
  children: ReactNode;
  style?: any;
}

const Drawer = React.forwardRef<View, DrawerProps>(
  ({ children, open = false, onOpenChange, ...props }, ref) => {
    return (
      <View ref={ref} {...props}>
        {children}
      </View>
    );
  }
);
Drawer.displayName = 'Drawer';

const DrawerTrigger = ({ children, onPress }: { 
  children: ReactNode; 
  onPress?: () => void; 
}) => (
  <TouchableOpacity onPress={onPress}>
    {children}
  </TouchableOpacity>
);

const DrawerPortal = ({ children }: { children: ReactNode }) => <>{children}</>;

const DrawerClose = ({ onPress }: { onPress?: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.closeButton}>
    <View style={styles.handle} />
  </TouchableOpacity>
);

const DrawerOverlay = ({ style }: { style?: any }) => (
  <TouchableOpacity 
    style={[styles.overlay, style]} 
    activeOpacity={1}
  />
);

const DrawerContent = React.forwardRef<View, DrawerContentProps>(
  ({ children, style, ...props }, ref) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
      >
        <DrawerOverlay />
        <View 
          ref={ref}
          style={[styles.content, style]} 
          {...props}
        >
          <DrawerClose />
          {children}
        </View>
      </Modal>
    );
  }
);
DrawerContent.displayName = 'DrawerContent';

const DrawerHeader = ({ children, style }: { 
  children: ReactNode; 
  style?: any; 
}) => (
  <View style={[styles.header, style]}>
    {children}
  </View>
);

const DrawerFooter = ({ children, style }: { 
  children: ReactNode; 
  style?: any; 
}) => (
  <View style={[styles.footer, style]}>
    {children}
  </View>
);

const DrawerTitle = ({ children, style }: { 
  children: ReactNode; 
  style?: any; 
}) => (
  <Text style={[styles.title, style]}>
    {children}
  </Text>
);

const DrawerDescription = ({ children, style }: { 
  children: ReactNode; 
  style?: any; 
}) => (
  <Text style={[styles.description, style]}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.8,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  closeButton: {
    alignItems: 'center',
  },
  header: {
    padding: 16,
    gap: 6,
  },
  footer: {
    padding: 16,
    gap: 8,
    marginTop: 'auto',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerOverlay,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};

export default function _Component() { return null; }
