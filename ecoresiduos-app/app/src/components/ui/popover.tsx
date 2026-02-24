import React, { useState, ReactNode } from "react"
import {
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native"

interface PopoverProps {
  trigger: ReactNode
  children: ReactNode
}

const Popover = ({ trigger, children }: PopoverProps) => {
  const [visible, setVisible] = useState(false)

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)}>
        {trigger}
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.content}>
            {children}
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: 280,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    elevation: 6,
  },
})

export { Popover }
export default function _Component() { return null; }
