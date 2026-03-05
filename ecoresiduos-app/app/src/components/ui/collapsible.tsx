import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ViewProps,
} from 'react-native';

interface CollapsibleProps extends ViewProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: StyleProp<ViewStyle>;
  maxHeight?: number;
}

const Collapsible = React.forwardRef<
  React.ElementRef<typeof View>,
  CollapsibleProps
>(
  (
    {
      children,
      open,
      onOpenChange,
      style,
      maxHeight = 300,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(false);

    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;

    const animatedHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(animatedHeight, {
        toValue: isOpen ? maxHeight : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, [isOpen, maxHeight, animatedHeight]);

    const handlePress = () => {
      const newValue = !isOpen;

      if (!isControlled) {
        setInternalOpen(newValue);
      }

      onOpenChange?.(newValue);
    };

    return (
      <View ref={ref} style={[styles.root, style]} {...props}>
        <TouchableOpacity style={styles.trigger} onPress={handlePress}>
          <Text style={styles.triggerText}>
            {isOpen ? 'Ocultar contenido' : 'Mostrar contenido'}
          </Text>
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.content,
            {
              height: animatedHeight,
            },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    );
  }
);

Collapsible.displayName = 'Collapsible';

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  trigger: {
    paddingVertical: 12,
  },
  triggerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    overflow: 'hidden',
  },
});

export { Collapsible };
export default function _Component() { return null; }
