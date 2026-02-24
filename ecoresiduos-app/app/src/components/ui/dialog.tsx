'use client';

import React, { ReactNode } from 'react';
import { 
  View, 
  Modal, 
  TouchableOpacity, 
  Text, 
  StyleSheet 
} from 'react-native';
import { X } from 'lucide-react-native';

interface DialogProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DialogContentProps {
  children: ReactNode;
  style?: any;
}

const Dialog = React.forwardRef<View, DialogProps>(
  ({ children, open = false, onOpenChange, ...props }, ref) => {
    return (
      <View ref={ref} {...props}>
        {children}
      </View>
    );
  }
);
Dialog.displayName = 'Dialog';

const DialogTrigger = ({ children, onPress }: { 
  children: ReactNode; 
  onPress?: () => void; 
}) => (
  <TouchableOpacity onPress={onPress}>
    {children}
  </TouchableOpacity>
);

const DialogPortal = ({ children }: { children: ReactNode }) => <>{children}</>;

const DialogClose = ({ onPress }: { onPress?: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.closeButton}>
    <X size={20} color="#9ca3af" />
  </TouchableOpacity>
);

const DialogOverlay = ({ style }: { style?: any }) => (
  <TouchableOpacity 
    style={[styles.overlay, style]} 
    activeOpacity={1}
  />
);

const DialogContent = React.forwardRef<View, DialogContentProps>(
  ({ children, style, ...props }, ref) => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent
      >
        <DialogOverlay />
        <View 
          ref={ref}
          style={[styles.content, style]} 
          {...props}
        >
          {children}
        </View>
      </Modal>
    );
  }
);
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ children, style }: { 
  children: ReactNode; 
  style?: any; 
}) => (
  <View style={[styles.header, style]}>
    {children}
  </View>
);

const DialogFooter = ({ children, style }: { 
  children: ReactNode; 
  style?: any; 
}) => (
  <View style={[styles.footer, style]}>
    {children}
  </View>
);

const DialogTitle = ({ children, style }: { 
  children: ReactNode; 
  style?: any; 
}) => (
  <Text style={[styles.title, style]}>
    {children}
  </Text>
);

const DialogDescription = ({ children, style }: { 
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
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    maxWidth: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    padding: 24,
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
  },
  header: {
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

export default function _Component() { return null; }
