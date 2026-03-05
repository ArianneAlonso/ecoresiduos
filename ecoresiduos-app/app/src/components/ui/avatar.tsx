'use client';

import React, { ReactNode } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface AvatarProps {
  children?: ReactNode;
  style?: any;
}

const Avatar = React.forwardRef<View, AvatarProps>(({ children, style, ...props }, ref) => (
  <View 
    ref={ref}
    style={[styles.avatar, style]} 
    {...props}
  >
    {children}
  </View>
));
Avatar.displayName = 'Avatar';

const AvatarImage = React.forwardRef<Image, { src?: string; style?: any; children?: ReactNode }>(
  ({ src, style, ...props }, ref) => (
    <Image 
      ref={ref}
      source={{ uri: src }} 
      style={[styles.image, style]} 
      {...props}
    />
  )
);
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = React.forwardRef<View, { children?: ReactNode; style?: any }>(
  ({ children, style, ...props }, ref) => (
    <View 
      ref={ref}
      style={[styles.fallback, style]} 
      {...props}
    >
      {children || <Text style={styles.fallbackText}>AA</Text>}
    </View>
  )
);
AvatarFallback.displayName = 'AvatarFallback';

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    // Borde sutil como en original
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  fallback: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
  },
});

export { Avatar, AvatarImage, AvatarFallback };

export default function _Component() { return null; }
