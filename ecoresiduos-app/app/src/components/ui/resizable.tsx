import React, { useState } from "react";
import { View, StyleSheet, PanResponder, LayoutChangeEvent } from "react-native";

interface ResizablePanelProps {
  children: React.ReactNode;
  style?: any;
  initialSize?: number; // porcentaje inicial del panel
  minSize?: number;     // porcentaje mínimo
  maxSize?: number;     // porcentaje máximo
}

interface ResizableHandleProps {
  onDrag: (delta: number) => void;
  horizontal?: boolean;
  style?: any;
}

export const ResizablePanelGroup: React.FC<{
  children: React.ReactNode[];
  horizontal?: boolean;
  style?: any;
}> = ({ children, horizontal = false, style }) => {
  const [sizes, setSizes] = useState<number[]>(
    children.map(() => 1 / children.length)
  );

  const onDrag = (index: number, delta: number) => {
    setSizes((prev) => {
      const total = prev[index] + prev[index + 1];
      let first = prev[index] + delta;
      let second = prev[index + 1] - delta;

      if (first < 0.1) {
        first = 0.1;
        second = total - first;
      }
      if (second < 0.1) {
        second = 0.1;
        first = total - second;
      }

      const newSizes = [...prev];
      newSizes[index] = first;
      newSizes[index + 1] = second;
      return newSizes;
    });
  };

  return (
    <View
      style={[
        { flexDirection: horizontal ? "row" : "column", flex: 1 },
        style,
      ]}
    >
      {children.map((child, i) => (
        <React.Fragment key={i}>
          <View style={{ flex: sizes[i] }}>{child}</View>
          {i < children.length - 1 && (
            <ResizableHandle
              horizontal={horizontal}
              onDrag={(delta) => onDrag(i, delta)}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

export const ResizableHandle: React.FC<ResizableHandleProps> = ({
  onDrag,
  horizontal = false,
  style,
}) => {
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const delta = horizontal
        ? gestureState.dx / 300 // dividir por tamaño base para porcentaje
        : gestureState.dy / 500;
      onDrag(delta);
    },
    onPanResponderTerminationRequest: () => false,
    onPanResponderRelease: () => {},
  });

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        horizontal ? styles.handleVertical : styles.handleHorizontal,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  handleHorizontal: {
    height: 10,
    backgroundColor: "#ccc",
    width: "100%",
    cursor: "row-resize",
  },
  handleVertical: {
    width: 10,
    backgroundColor: "#ccc",
    height: "100%",
    cursor: "col-resize",
  },
});
export default function _Component() { return null; }
