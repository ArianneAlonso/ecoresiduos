'use client';

import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

interface AspectRatioProps {
  ratio: number; // width/height ratio (ej: 16/9 = 1.777)
  children: ReactNode;
  style?: any;
}

const AspectRatio = ({ ratio, children, style, ...props }: AspectRatioProps) => {
  return (
    <View 
      style={[
        { aspectRatio: ratio },
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
};

export { AspectRatio };

export default function _Component() { return null; }
