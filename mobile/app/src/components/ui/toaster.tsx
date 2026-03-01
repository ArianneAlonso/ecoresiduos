'use client';

import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { X } from 'lucide-react-native';
import { useToast } from '../ui/toast';

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <View style={styles.viewport}>
      {toasts.map((toast) => (
        <ToastRenderer 
          key={toast.id} 
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </View>
  );
}

function ToastRenderer({ 
  toast, 
  onClose 
}: { 
  toast: any; 
  onClose: () => void;
}) {
  return (
    <View style={[
      styles.toastContainer,
      toast.variant === 'destructive' && styles.toastDestructive
    ]}>
      <View style={styles.toastContent}>
        {toast.title && <Text style={styles.toastTitle}>{toast.title}</Text>}
        {toast.description && (
          <Text style={styles.toastDescription}>{toast.description}</Text>
        )}
      </View>
      {toast.action}
      <TouchableOpacity 
        style={styles.toastClose} 
        onPress={onClose}
        activeOpacity={0.7}
      >
        <X size={16} color="#6b7280" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 100,
    gap: 12,
  },
  toastContainer: {
    width: '100%',
    maxWidth: 420,
    padding: 16,
    paddingRight: 64,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  toastDestructive: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  toastContent: {
    gap: 4,
    flex: 1,
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
  toastClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
    borderRadius: 4,
  },
});

export default function _Component() { return null; }
