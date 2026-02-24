import React from "react"
import {
  TextInput,
  TextInputProps,
  StyleSheet,
} from "react-native"

interface InputProps extends TextInputProps {}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        style={[styles.input, style]}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
})

export { Input }
export default function _Component() { return null; }
