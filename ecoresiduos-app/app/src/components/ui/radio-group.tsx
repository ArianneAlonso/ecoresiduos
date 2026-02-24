import React from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native"

interface RadioOption {
  label: string
  value: string
}

interface RadioGroupProps {
  options: RadioOption[]
  value: string
  onValueChange: (value: string) => void
}

const RadioGroup = ({
  options,
  value,
  onValueChange,
}: RadioGroupProps) => {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const selected = value === option.value

        return (
          <TouchableOpacity
            key={option.value}
            style={styles.option}
            onPress={() => onValueChange(option.value)}
          >
            <View
              style={[
                styles.radioOuter,
                selected && styles.radioOuterSelected,
              ]}
            >
              {selected && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.label}>{option.label}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#1f5c2e",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioOuterSelected: {
    borderColor: "#1f5c2e",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#1f5c2e",
  },
  label: {
    fontSize: 16,
  },
})

export { RadioGroup }
export default function _Component() { return null; }
