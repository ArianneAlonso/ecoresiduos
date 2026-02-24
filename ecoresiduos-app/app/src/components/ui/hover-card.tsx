import React, { useState, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
} from 'react-native';

interface HoverCardProps {
  children: ReactNode;
}

interface HoverCardContentProps {
  children: ReactNode;
  style?: any;
}

const HoverCard = ({ children }: HoverCardProps) => {
  return <View>{children}</View>;
};

const HoverCardTrigger = ({
  children,
  onOpen,
}: {
  children: ReactNode;
  onOpen?: () => void;
}) => {
  return (
    <Pressable onLongPress={onOpen}>
      {children}
    </Pressable>
  );
};

const HoverCardContent = ({
  children,
  visible,
  onClose,
  style,
}: HoverCardContentProps & {
  visible: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.content, style]}>
          {typeof children === 'string' ? (
            <Text style={styles.text}>{children}</Text>
          ) : (
            children
          )}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  content: {
    width: 250,
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'white',
    elevation: 10,
  },
  text: {
    fontSize: 14,
    color: '#111827',
  },
});

export { HoverCard, HoverCardTrigger, HoverCardContent };
export default function _Component() { return null; }
