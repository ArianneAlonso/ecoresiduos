'use client';

import React, { createContext, useContext, useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
}

function TooltipProvider({ 
  children, 
  delayDuration = 500 
}: TooltipProviderProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      {children}
    </TooltipContext.Provider>
  );
}

function Tooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function TooltipTrigger({ 
  children, 
  delayDuration = 500,
  style 
}: { 
  children: React.ReactNode; 
  delayDuration?: number;
  style?: any;
}) {
  const context = useContext(TooltipContext);
  if (!context) throw new Error('TooltipTrigger must be used within TooltipProvider');

  return (
    <TouchableOpacity 
      style={style}
      onPressIn={() => setTimeout(() => context.setOpen(true), delayDuration)}
      onPressOut={() => context.setOpen(false)}
      activeOpacity={1}
    >
      {children}
    </TouchableOpacity>
  );
}

function TooltipContent({ 
  children, 
  sideOffset = 4,
  style 
}: { 
  children: React.ReactNode; 
  sideOffset?: number;
  style?: any;
}) {
  const context = useContext(TooltipContext);
  if (!context || !context.open) return null;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    if (context.open) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [context.open]);

  return (
    <Animated.View style={[
      styles.content,
      {
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      },
      style,
    ]}>
      <Text style={styles.text}>{children}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  content: {
    position: 'absolute',
    zIndex: 50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
    backgroundColor: '#373a40',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#404448',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: 250,
  },
  text: {
    fontSize: 14,
    color: '#f8fafc',
    lineHeight: 18,
  },
});

export { 
  TooltipProvider, 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent 
};

export default function _Component() { return null; }
