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
import { X } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type SheetSide = 'top' | 'bottom' | 'left' | 'right';

interface SheetProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface SheetContentProps {
  side?: SheetSide;
  children: ReactNode;
  style?: any;
}

const Sheet = React.forwardRef<View, SheetProps>(
  ({ children, open = false, onOpenChange, ...props }, ref) => {
    return (
      <View ref={ref} {...props}>
        {children}
      </View>
    );
  }
);
Sheet.displayName = 'Sheet';

const SheetTrigger = ({ children, onPress }: { 
  children: ReactNode; 
  onPress?: () => void; 
}) => (
  <TouchableOpacity onPress={onPress}>
    {children}
  </TouchableOpacity>
);

const SheetPortal = ({ children }: { children: ReactNode }) => <>{children}</>;

const SheetClose = ({ onPress }: { onPress?: () => void }) => (
  <TouchableOpacity style={styles.closeButton} onPress={onPress}>
    <X size={20} color="#9ca3af" />
  </TouchableOpacity>
);

const SheetOverlay = ({ style }: { style?: any }) => (
  <TouchableOpacity 
    style={[styles.overlay, style]} 
    activeOpacity={1}
  />
);

const SheetContent = React.forwardRef<View, SheetContentProps>(
  ({ side = 'right', children, style, ...props }, ref) => {
    const sideStyles = {
      top: [styles.contentTop],
      bottom: [styles.contentBottom],
      left: [styles.contentLeft],
      right: [styles.contentRight],
    };

    return (
      <Modal
        animationType={side === 'bottom' ? 'slide' : 'fade'}
        transparent={true}
      >
        <SheetOverlay />
        <View 
          ref={ref}
          style={[sideStyles[side], style]} 
          {...props}
        >
          <SheetClose />
          {children}
        </View>
      </Modal>
    );
  }
);
SheetContent.displayName = 'SheetContent';

const SheetHeader = ({ children, style }: { 
  children: ReactNode; 
  style?: any; 
}) => (
  <View style={[styles.header, style]}>
    {children}
  </View>
);

const SheetFooter = ({ children, style }: { 
  children: ReactNode; 
  style?: any; 
}) => (
  <View style={[styles.footer, style]}>
    {children}
  </View>
);

const SheetTitle = ({ children, style }: { 
  children: ReactNode; 
  style?: any; 
}) => (
  <Text style={[styles.title, style]}>
    {children}
  </Text>
);

const SheetDescription = ({ children, style }: { 
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
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  contentTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  contentBottom: {
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
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  contentLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: screenWidth * 0.75,
    maxWidth: 320,
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  contentRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: screenWidth * 0.75,
    maxWidth: 320,
    backgroundColor: 'white',
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'column',
    gap: 8,
    padding: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginTop: 'auto',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export {
  Sheet,
  SheetTrigger,
  SheetPortal,
  SheetOverlay,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};

export default function _Component() { return null; }
