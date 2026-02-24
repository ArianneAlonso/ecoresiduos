import React from "react"
import {
  Text,
  TextProps,
  StyleSheet,
} from "react-native"

interface LabelProps extends TextProps {
  disabled?: boolean
}

const Label = React.forwardRef<Text, LabelProps>(
  ({ style, disabled, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        style={[
          styles.label,
          disabled && styles.disabled,
          style,
        ]}
        {...props}
      />
    )
  }
)

Label.displayName = "Label"

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  disabled: {
    opacity: 0.7,
  },
})

export { Label }
export default function _Component() { return null; }
