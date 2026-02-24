'use client';

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: any;
  children?: React.ReactNode;
}

function Skeleton({ 
  width = '100%', 
  height = 16, 
  style, 
  children 
}: SkeletonProps) {
  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          opacity: pulseAnim,
          borderRadius: height / 2,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
});

export { Skeleton };

export default function _Component() { return null; }
