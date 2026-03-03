import React, { ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewProps,
  TextProps,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { ChevronRight, MoreHorizontal } from 'lucide-react-native';

interface BreadcrumbProps extends ViewProps {
  children: ReactNode;
}

interface BreadcrumbListProps extends ViewProps {
  children: ReactNode;
}

interface BreadcrumbItemProps extends ViewProps {
  children: ReactNode;
}

interface BreadcrumbLinkProps extends TouchableOpacityProps {
  children: ReactNode;
}

interface BreadcrumbPageProps extends TextProps {
  children: ReactNode;
}

const Breadcrumb = React.forwardRef<
  React.ElementRef<typeof View>,
  BreadcrumbProps
>(({ children, style, ...props }, ref) => (
  <View ref={ref} style={[styles.breadcrumb, style]} {...props}>
    {children}
  </View>
));
Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList = React.forwardRef<
  React.ElementRef<typeof View>,
  BreadcrumbListProps
>(({ children, style, ...props }, ref) => (
  <View ref={ref} style={[styles.list, style]} {...props}>
    {children}
  </View>
));
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = React.forwardRef<
  React.ElementRef<typeof View>,
  BreadcrumbItemProps
>(({ children, style, ...props }, ref) => (
  <View ref={ref} style={[styles.item, style]} {...props}>
    {children}
  </View>
));
BreadcrumbItem.displayName = 'BreadcrumbItem';

const BreadcrumbLink = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  BreadcrumbLinkProps
>(({ children, style, ...props }, ref) => (
  <TouchableOpacity
    ref={ref}
    style={[styles.link, style]}
    activeOpacity={0.7}
    {...props}
  >
    {children}
  </TouchableOpacity>
));
BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage = React.forwardRef<
  React.ElementRef<typeof Text>,
  BreadcrumbPageProps
>(({ children, style, ...props }, ref) => (
  <Text ref={ref} style={[styles.page, style]} {...props}>
    {children}
  </Text>
));
BreadcrumbPage.displayName = 'BreadcrumbPage';

interface SeparatorProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const BreadcrumbSeparator = ({ children, style }: SeparatorProps) => (
  <View style={[styles.separator, style]}>
    {children ?? <ChevronRight size={14} color="#9ca3af" />}
  </View>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

interface EllipsisProps {
  style?: StyleProp<ViewStyle>;
}

const BreadcrumbEllipsis = ({ style }: EllipsisProps) => (
  <View style={[styles.ellipsis, style]}>
    <MoreHorizontal size={16} color="#9ca3af" />
  </View>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

const styles = StyleSheet.create({
  breadcrumb: {
    paddingVertical: 8,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  link: {
    paddingVertical: 4,
    marginRight: 6,
  },
  page: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  separator: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  ellipsis: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#f9fafb',
    marginRight: 6,
  },
});

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
export default function _Component() { return null; }
