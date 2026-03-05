'use client';

import React from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity 
} from 'react-native';

interface PropsWithChildren<T = {}> {
  children: React.ReactNode;
  style?: any;
  [key: string]: any;
}

const Table = React.forwardRef<View, PropsWithChildren>(({ 
  children, 
  style, 
  scrollable = true 
}, ref) => (
  <View style={[styles.tableWrapper, style]} ref={ref as any}>
    {scrollable ? (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>{children}</View>
      </ScrollView>
    ) : (
      <View style={styles.table}>{children}</View>
    )}
  </View>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<View, PropsWithChildren>(({ 
  children, 
  style 
}, ref) => (
  <View ref={ref as any} style={[styles.tableHeader, style]}>
    {children}
  </View>
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<View, PropsWithChildren>(({ 
  children, 
  style 
}, ref) => (
  <View ref={ref as any} style={[styles.tableBody, style]}>
    {children}
  </View>
));
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef<View, PropsWithChildren & { onPress?: () => void }>(({ 
  children, 
  style, 
  onPress 
}, ref) => (
  <TouchableOpacity 
    ref={ref as any}
    style={[styles.tableRow, style]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {children}
  </TouchableOpacity>
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<View, PropsWithChildren>(({ 
  children, 
  style 
}, ref) => (
  <View ref={ref as any} style={[styles.tableHead, style]}>
    <Text style={styles.tableHeadText}>{children}</Text>
  </View>
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<View, PropsWithChildren>(({ 
  children, 
  style 
}, ref) => (
  <View ref={ref as any} style={[styles.tableCell, style]}>
    <Text style={styles.tableCellText} numberOfLines={1}>
      {React.Children.toArray(children)[0]}
    </Text>
  </View>
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<View, PropsWithChildren>(({ 
  children, 
  style 
}, ref) => (
  <View ref={ref as any} style={[styles.tableCaption, style]}>
    <Text style={styles.tableCaptionText}>{children}</Text>
  </View>
));
TableCaption.displayName = 'TableCaption';

const styles = StyleSheet.create({
  tableWrapper: {
    width: '100%',
    backgroundColor: '#fff',
  },
  table: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableHeader: {
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableBody: {
    backgroundColor: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tableHead: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  tableHeadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'left',
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    minHeight: 48,
  },
  tableCellText: {
    fontSize: 14,
    color: '#334155',
    textAlign: 'left',
  },
  tableCaption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tableCaptionText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};

export default function _Component() { return null; }
