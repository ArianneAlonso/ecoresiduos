import React, { forwardRef } from "react";
import { ScrollView, View, StyleSheet, type ScrollViewProps, type ViewStyle } from "react-native";

interface ScrollAreaProps extends ScrollViewProps {
  containerStyle?: ViewStyle;
  showScrollIndicator?: boolean;
}

const ScrollArea = forwardRef<ScrollView, ScrollAreaProps>(
  ({ children, containerStyle, showScrollIndicator = true, ...props }, ref) => {
    return (
      <ScrollView
        ref={ref}
        style={[styles.scrollView, containerStyle]}
        showsVerticalScrollIndicator={showScrollIndicator}
        showsHorizontalScrollIndicator={showScrollIndicator}
        {...props}
      >
        {children}
      </ScrollView>
    );
  }
);
ScrollArea.displayName = "ScrollArea";

const ScrollAreaContainer = forwardRef<View, React.PropsWithChildren<{ style?: ViewStyle }>>(
  ({ children, style }, ref) => (
    <View ref={ref} style={[styles.container, style]}>
      {children}
    </View>
  )
);
ScrollAreaContainer.displayName = "ScrollAreaContainer";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  scrollView: {
    flexGrow: 1,
  },
});

export { ScrollArea, ScrollAreaContainer };
export default function _Component() { return null; }
