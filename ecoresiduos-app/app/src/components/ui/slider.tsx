'use client';

import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Animated } from 'react-native';

interface SliderProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  style?: any;
  trackStyle?: any;
  thumbStyle?: any;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  disabled?: boolean;
}

function Slider({
  value: controlledValue,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  minimumTrackTintColor = '#1f5c2e',
  maximumTrackTintColor = '#e5e7eb',
  thumbTintColor = '#ffffff',
  disabled = false,
  style,
  trackStyle,
  thumbStyle,
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const translateX = useRef(new Animated.Value(0)).current;
  const trackWidthRef = useRef(300);
  const thumbSize = 20;

  // Functions moved BEFORE first use
  const valueToPosition = (val: number): number => {
    return ((val - min) / (max - min)) * (trackWidthRef.current - thumbSize);
  };

  const positionToValue = (x: number): number => {
    const clampedX = Math.max(0, Math.min(x, trackWidthRef.current - thumbSize));
    const val = min + (clampedX / (trackWidthRef.current - thumbSize)) * (max - min);
    return Math.round(val / step) * step;
  };

  // Initialize position on mount and value change
  useEffect(() => {
    const position = valueToPosition(value);
    translateX.setValue(position);
  }, [value, min, max, step]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled,
    onMoveShouldSetPanResponder: () => !disabled,
    onPanResponderGrant: () => {
      translateX.setOffset(valueToPosition(value));
    },
    onPanResponderMove: (_, gestureState) => {
      // Fix: Use extractOffset instead of _offset
      translateX.extractOffset();
      const newPosition = gestureState.dx;
      const newValue = positionToValue(newPosition);
      const newX = valueToPosition(newValue);
      
      translateX.setValue(newX);
      onValueChange?.(newValue);
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
    },
    onPanResponderRelease: () => {
      translateX.flattenOffset();
    },
  });

  const trackLeft = valueToPosition(value);

  return (
    <View 
      style={[styles.root, style]}
      onLayout={(event) => {
        trackWidthRef.current = event.nativeEvent.layout.width;
      }}
    >
      <View
        style={[
          styles.track,
          { 
            backgroundColor: maximumTrackTintColor,
            height: 4,
          },
          trackStyle,
        ]}
      />
      <View
        style={[
          styles.range,
          {
            left: 0,
            width: trackLeft,
            backgroundColor: minimumTrackTintColor,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.thumb,
          {
            backgroundColor: thumbTintColor,
            borderColor: minimumTrackTintColor,
            transform: [{ translateX }],
          },
          thumbStyle,
        ]}
        {...panResponder.panHandlers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 32,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  range: {
    position: 'absolute',
    height: '100%',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export { Slider };

export default function _Component() { return null; }
