'use client';

import React, { createContext, useContext, useState, ReactNode, Children, useCallback } from 'react';
import { View, TouchableOpacity, ScrollView, Text, StyleSheet } from 'react-native';

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

function Tabs({ 
  value: externalValue, 
  defaultValue, 
  onValueChange: externalOnValueChange, 
  children 
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const value = externalValue !== undefined ? externalValue : internalValue;
  const handleValueChange = useCallback((newValue: string) => {
    if (externalOnValueChange) {
      externalOnValueChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  }, [externalOnValueChange]);

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <View style={styles.tabs}>
        {children}
      </View>
    </TabsContext.Provider>
  );
}

function TabsList({ children, style }: { children: ReactNode; style?: any }) {
  return (
    <ScrollView 
      style={[styles.tabsList, style]}
      horizontal 
      showsHorizontalScrollIndicator={false}
    >
      {Children.map(children, child => child)}
    </ScrollView>
  );
}

function TabsTrigger({ 
  value, 
  children, 
  style 
}: { 
  value: string; 
  children: ReactNode; 
  style?: any; 
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');
  
  const isActive = context.value === value;
  
  const handlePress = () => {
    context.onValueChange(value);
  };

  return (
    <TouchableOpacity
      style={[
        styles.tabsTrigger,
        isActive && styles.tabsTriggerActive,
        style
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.tabsTriggerText,
        isActive && styles.tabsTriggerTextActive
      ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

function TabsContent({ 
  value, 
  children, 
  style 
}: { 
  value: string; 
  children: ReactNode; 
  style?: any; 
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');
  
  if (context.value !== value) return null;

  return (
    <View style={[styles.tabsContent, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    width: '100%',
  },
  tabsList: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    padding: 4,
    borderRadius: 8,
    gap: 4,
  },
  tabsTrigger: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 44,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsTriggerActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabsTriggerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  tabsTriggerTextActive: {
    color: '#0f172a',
    fontWeight: '600',
  },
  tabsContent: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});

export { Tabs, TabsList, TabsTrigger, TabsContent };

export default function _Component() { return null; }
