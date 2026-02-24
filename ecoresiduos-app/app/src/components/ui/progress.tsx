import React from "react"
import { View, StyleSheet } from "react-native"

interface ProgressProps {
  value?: number
}

const Progress = ({ value = 0 }: ProgressProps) => {
  const progress = Math.min(Math.max(value, 0), 100)

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.indicator,
          { width: `${progress}%` },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 16,
    width: "100%",
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    overflow: "hidden",
  },
  indicator: {
    height: "100%",
    backgroundColor: "#1f5c2e",
  },
})

export { Progress }
export default function _Component() { return null; }
