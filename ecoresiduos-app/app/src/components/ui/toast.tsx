'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { View, Animated, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { X } from 'lucide-react-native';

interface ToastContextType {
  toasts: Array<any>;
  addToast: (toast: any) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: React.ReactNode;
}

interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
  action?: React.ReactNode;
}

function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  
  const addToast = (toast: ToastProps) => {
    setToasts((prev) => [...prev, toast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
}

function ToastViewport() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('ToastViewport must be used within ToastProvider');

  return (
    <View style={styles.viewport}>
      {context.toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </View>
  );
}

function Toast({ id, title, description, variant = 'default', duration = 5000, action }: ToastProps) {
  const context = useContext(ToastContext);
  if (!context) throw new Error('Toast must be used within ToastProvider');
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        context.removeToast(id);
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, context, slideAnim, fadeAnim]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      context.removeToast(id);
    });
  };

  const toastStyle = variant === 'destructive' ? styles.toastDestructive : styles.toastDefault;

  return (
    <Animated.View style={[
      styles.toast,
      toastStyle,
      {
        opacity: fadeAnim,
        transform: [{
          translateX: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [Dimensions.get('window').width, 0],
          }),
        }],
      },
    ]}>
      <View style={styles.toastContent}>
        {title && <ToastTitle>{title}</ToastTitle>}
        {description && <ToastDescription>{description}</ToastDescription>}
        {action}
      </View>
      <TouchableOpacity style={styles.toastCloseBtn} onPress={handleClose} activeOpacity={0.7}>
        <X size={16} color="#6b7280" />
      </TouchableOpacity>
    </Animated.View>
  );
}

function ToastAction({ children, style, ...props }: any) {
  return (
    <TouchableOpacity style={[styles.toastActionButton, style]} {...props}>
      {children}
    </TouchableOpacity>
  );
}

function ToastClose({ style, ...props }: any) {
  return (
    <TouchableOpacity style={[styles.toastCloseButton, style]} {...props} activeOpacity={0.7}>
      <X size={16} color="#6b7280" />
    </TouchableOpacity>
  );
}

function ToastTitle({ children, style }: any) {
  return <Text style={[styles.toastTitle, style]}>{children}</Text>;
}

function ToastDescription({ children, style }: any) {
  return <Text style={[styles.toastDescription, style]}>{children}</Text>;
}

function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

const styles = StyleSheet.create({
  viewport: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 100,
    maxHeight: '90%',
    gap: 12,
  },
  toast: {
    width: '100%',
    maxWidth: 420,
    padding: 16,
    paddingRight: 64,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  toastDefault: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  toastDestructive: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  toastContent: {
    flex: 1,
    gap: 4,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  toastDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  toastActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  toastCloseButton: {
    padding: 4,
    borderRadius: 4,
  },

  toastCloseBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
    borderRadius: 4,
  },
});

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  useToast,
};

export default function _Component() { return null; }
