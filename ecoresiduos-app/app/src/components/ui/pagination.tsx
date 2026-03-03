import React from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react-native"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pages = getVisiblePages(currentPage, totalPages)

  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={currentPage === 1}
        onPress={() => onPageChange(currentPage - 1)}
        style={[
          styles.navButton,
          currentPage === 1 && styles.disabled,
        ]}
      >
        <ChevronLeft size={18} />
      </TouchableOpacity>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <View key={index} style={styles.ellipsis}>
            <MoreHorizontal size={18} />
          </View>
        ) : (
          <TouchableOpacity
            key={index}
            onPress={() => onPageChange(page)}
            style={[
              styles.pageButton,
              currentPage === page && styles.active,
            ]}
          >
            <Text
              style={[
                styles.pageText,
                currentPage === page && styles.activeText,
              ]}
            >
              {page}
            </Text>
          </TouchableOpacity>
        )
      )}

      <TouchableOpacity
        disabled={currentPage === totalPages}
        onPress={() => onPageChange(currentPage + 1)}
        style={[
          styles.navButton,
          currentPage === totalPages && styles.disabled,
        ]}
      >
        <ChevronRight size={18} />
      </TouchableOpacity>
    </View>
  )
}

function getVisiblePages(current: number, total: number) {
  const pages: (number | "ellipsis")[] = []

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current > 2) pages.push(1)
    if (current > 3) pages.push("ellipsis")

    for (
      let i = Math.max(1, current - 1);
      i <= Math.min(total, current + 1);
      i++
    ) {
      pages.push(i)
    }

    if (current < total - 2) pages.push("ellipsis")
    if (current < total - 1) pages.push(total)
  }

  return pages
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  pageButton: {
    minWidth: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  active: {
    backgroundColor: "#1f5c2e",
  },
  pageText: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeText: {
    color: "#ffffff",
  },
  navButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.4,
  },
  ellipsis: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
})

export { Pagination }
export default function _Component() { return null; }
