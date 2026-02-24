'use client';

import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import React, { useState, useRef, ReactNode } from 'react';
import { ViewStyle, TextStyle } from 'react-native';

interface AccordionProps {
  children: ReactNode;
  style?: ViewStyle;
}

interface AccordionItemProps {
  children: ReactNode;
  style?: ViewStyle;
}

interface AccordionTriggerProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

interface AccordionContentProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function Accordion({ children, style, ...props }: AccordionProps) {
  return <View style={[styles.accordionRoot, style]} {...props}>{children}</View>;
}

export function AccordionItem({ children, style, ...props }: AccordionItemProps) {
  return (
    <View style={[styles.accordionItem, style]} {...props}>
      {children}
    </View>
  );
}

export function AccordionTrigger({ 
  children, 
  onPress, 
  style, 
  ...props 
}: AccordionTriggerProps) {
  const [open, setOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    setOpen(!open);
    Animated.timing(rotateAnim, {
      toValue: open ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    onPress?.();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <TouchableOpacity style={[styles.trigger, style]} onPress={handlePress} {...props}>
      <View style={styles.triggerContent}>
        <Text style={styles.triggerText}>{children as string}</Text>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <ChevronDown size={16} color="#666" />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

export function AccordionContent({ children, style, ...props }: AccordionContentProps) {
  const [open, setOpen] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (open) {
      Animated.spring(heightAnim, {
        toValue: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(heightAnim, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    }
  }, [open]);

  return (
    <Animated.View 
      style={[
        styles.content, 
        { maxHeight: heightAnim },
        style
      ]} 
      {...props}
    >
      <View style={styles.contentInner}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  accordionRoot: {
    gap: 4,
  },
  accordionItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  trigger: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    overflow: 'hidden',
  },
  contentInner: {
    paddingBottom: 16,
    paddingTop: 0,
  },
});

export default function _Component() { return null; }
