'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { PanelLeft } from 'lucide-react-native';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './sheet';
import { Button } from './button';
import { Input } from './input';
import { Separator } from './separator';
import { useWindowDimensions } from 'react-native';

const SIDEBAR_WIDTH = 256;
const SIDEBAR_ICON_WIDTH = 72;
const SIDEBAR_WIDTH_MOBILE = 280;

interface SidebarContextProps {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
}

interface SidebarProviderProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

function SidebarProvider({ 
  defaultOpen = true, 
  open: openProp, 
  onOpenChange: setOpenProp, 
  children 
}: SidebarProviderProps) {
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < 768;
  const [openMobile, setOpenMobile] = useState(false);
  const [_open, _setOpen] = useState(defaultOpen);
  
  const open = openProp ?? _open;
  
  // Fix: setOpen accepts boolean only, not function
  const setOpen = useCallback((value: boolean) => {
    if (setOpenProp) {
      setOpenProp(value);
    } else {
      _setOpen(value);
    }
  }, [setOpenProp]);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile(prev => !prev);
    } else {
      setOpen(!open);
    }
  }, [isMobile, setOpenMobile, setOpen, open]);

  const state: 'expanded' | 'collapsed' = open ? 'expanded' : 'collapsed';

  const contextValue: SidebarContextProps = {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      <View style={styles.provider}>
        {children}
      </View>
    </SidebarContext.Provider>
  );
}

interface SidebarProps {
  side?: 'left' | 'right';
  collapsible?: 'offcanvas' | 'icon' | 'none';
  children: ReactNode;
}

function Sidebar({ side = 'left', collapsible = 'offcanvas', children }: SidebarProps) {
  const { isMobile, openMobile, setOpenMobile, state } = useSidebar();
  const translateAnim = useState(new Animated.Value(0))[0];

  React.useEffect(() => {
    const translateX = state === 'collapsed' && collapsible === 'offcanvas' 
      ? (side === 'left' ? -SIDEBAR_WIDTH : SIDEBAR_WIDTH) 
      : 0;
    
    Animated.timing(translateAnim, {
      toValue: translateX,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [state, collapsible, side, translateAnim]);

  if (collapsible === 'none') {
    return (
      <View style={[styles.sidebarFixed, { width: SIDEBAR_WIDTH }]}>
        {children}
      </View>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent style={{ width: SIDEBAR_WIDTH_MOBILE, padding: 0 }}>
          <SheetHeader style={{ opacity: 0, height: 0 }}>
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Mobile sidebar</SheetDescription>
          </SheetHeader>
          <View style={{ flex: 1 }}>{children}</View>
        </SheetContent>
      </Sheet>
    );
  }

  const width = state === 'collapsed' && collapsible === 'icon' ? SIDEBAR_ICON_WIDTH : SIDEBAR_WIDTH;

  return (
    <Animated.View 
      style={[
        styles.sidebarDesktop,
        side === 'right' && styles.sidebarRight,
        { 
          transform: [{ translateX: translateAnim }],
          width,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

function SidebarTrigger({ style }: { style?: any }) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button 
      variant="ghost" 
      style={[styles.trigger, style]}
      onPress={toggleSidebar}
    >
      <PanelLeft size={20} />
    </Button>
  );
}

function SidebarInset({ children, style }: { children: ReactNode; style?: any }) {
  return <View style={[styles.inset, style]}>{children}</View>;
}

function SidebarContent({ children, style }: { children: ReactNode; style?: any }) {
  return <View style={[styles.content, style]}>{children}</View>;
}

function SidebarHeader({ children, style }: { children: ReactNode; style?: any }) {
  return <View style={[styles.header, style]}>{children}</View>;
}

function SidebarFooter({ children, style }: { children: ReactNode; style?: any }) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

function SidebarInput({ style, ...props }: any) {
  return <Input style={[styles.input, style]} {...props} />;
}

function SidebarSeparator({ orientation = 'horizontal', style }: any) {
  return <Separator orientation={orientation} style={style} />;
}

function SidebarGroup({ children, style }: { children: ReactNode; style?: any }) {
  return <View style={[styles.group, style]}>{children}</View>;
}

function SidebarMenu({ children, style }: { children: ReactNode; style?: any }) {
  return <View style={[styles.menu, style]}>{children}</View>;
}

function SidebarMenuItem({ children, style }: { children: ReactNode; style?: any }) {
  return <View style={[styles.menuItem, style]}>{children}</View>;
}

function SidebarMenuButton({ 
  children, 
  active = false, 
  style 
}: { 
  children: ReactNode; 
  active?: boolean; 
  style?: any;
}) {
  return (
    <View style={[styles.menuButton, active && styles.menuButtonActive, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  provider: {
    flex: 1,
    width: '100%',
  },
  sidebarFixed: {
    height: '100%',
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  sidebarDesktop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: '100%',
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    zIndex: 40,
  },
  sidebarRight: {
    borderRightWidth: 0,
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
  },
  trigger: {
    width: 32,
    height: 32,
  },
  inset: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    gap: 8,
  },
  footer: {
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  input: {
    height: 40,
    margin: 8,
  },
  group: {
    padding: 8,
  },
  menu: {
    gap: 4,
  },
  menuItem: {
    marginVertical: 2,
  },
  menuButton: {
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuButtonActive: {
    backgroundColor: '#f3f4f6',
  },
});

export {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarInput,
  SidebarSeparator,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
};

export default function _Component() { return null; }
