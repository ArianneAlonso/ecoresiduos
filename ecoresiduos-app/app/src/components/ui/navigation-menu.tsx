import React, { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native"
import { ChevronDown } from "lucide-react-native"

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

interface NavItem {
  label: string
  children?: { label: string; onPress: () => void }[]
  onPress?: () => void
}

interface NavigationMenuProps {
  items: NavItem[]
}

const NavigationMenu = ({ items }: NavigationMenuProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index}>
          <TouchableOpacity
            style={styles.trigger}
            onPress={() => {
              if (item.children) {
                toggle(index)
              } else {
                item.onPress?.()
              }
            }}
          >
            <Text style={styles.triggerText}>{item.label}</Text>
            {item.children && (
              <ChevronDown
                size={16}
                style={[
                  styles.icon,
                  openIndex === index && styles.iconOpen,
                ]}
              />
            )}
          </TouchableOpacity>

          {openIndex === index && item.children && (
            <View style={styles.content}>
              {item.children.map((child, childIndex) => (
                <TouchableOpacity
                  key={childIndex}
                  style={styles.item}
                  onPress={child.onPress}
                >
                  <Text style={styles.itemText}>
                    {child.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  trigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  triggerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    transform: [{ rotate: "0deg" }],
  },
  iconOpen: {
    transform: [{ rotate: "180deg" }],
  },
  content: {
    backgroundColor: "#f9fafb",
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  itemText: {
    fontSize: 15,
  },
})

export { NavigationMenu }
export default function _Component() { return null; }
