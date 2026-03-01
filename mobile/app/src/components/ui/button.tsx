import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
type Size = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends TouchableOpacityProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  ButtonProps
>(
  (
    {
      variant = 'default',
      size = 'default',
      children,
      disabled = false,
      style,
      textStyle,
      ...props
    },
    ref
  ) => {
    const baseStyle: StyleProp<ViewStyle> = [
      styles.base,
      variantStyles[variant],
      sizeStyles[size],
      disabled && styles.disabled,
      style,
    ];

    const textColor =
      variant === 'default' || variant === 'destructive'
        ? styles.primaryText
        : styles.secondaryText;

    return (
      <TouchableOpacity
        ref={ref}
        style={baseStyle}
        disabled={disabled}
        activeOpacity={0.8}
        {...props}
      >
        <Text style={[styles.text, textColor, textStyle]}>
          {children}
        </Text>
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#374151',
  },
});

const variantStyles: Record<Variant, ViewStyle> = {
  default: {
    backgroundColor: '#1f5c2e',
    borderColor: '#2563eb',
  },
  destructive: {
    backgroundColor: '#ef4444',
    borderColor: '#dc2626',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#d1d5db',
  },
  secondary: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
};

const sizeStyles: Record<Size, ViewStyle> = {
  default: {
    minHeight: 36,
    paddingVertical: 8,
  },
  sm: {
    minHeight: 32,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  lg: {
    minHeight: 40,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  icon: {
    width: 36,
    height: 36,
    padding: 0,
  },
};

export { Button };
export default function _Component() { return null; }
