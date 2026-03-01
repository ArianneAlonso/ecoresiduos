import React, { ReactNode } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ViewProps,
  TextInputProps,
  FlatListProps,
  TouchableOpacityProps,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { Dialog, DialogContent } from './dialog';

interface CommandProps extends ViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Command = React.forwardRef<View, CommandProps>(
  ({ children, style, ...props }, ref) => (
    <View ref={ref} style={[styles.command, style]} {...props}>
      {children}
    </View>
  )
);

Command.displayName = 'Command';

interface CommandDialogProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => (
  <Dialog {...props}>
    <DialogContent style={styles.dialogContent}>
      <Command style={styles.commandDialog}>{children}</Command>
    </DialogContent>
  </Dialog>
);

interface CommandInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

const CommandInput = React.forwardRef<TextInput, CommandInputProps>(
  ({ containerStyle, inputStyle, placeholder = 'Buscar...', style, ...props }, ref) => (
    <View style={[styles.inputWrapper, containerStyle]}>
      <Search size={20} color="#9ca3af" style={styles.searchIcon} />
      <TextInput
        ref={ref}
        style={[styles.input, style, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        autoCapitalize="none"
        {...props}
      />
    </View>
  )
);

CommandInput.displayName = 'CommandInput';

interface CommandListProps<ItemT>
  extends Omit<FlatListProps<ItemT>, 'data' | 'renderItem'> {
  data: ItemT[];
  renderItem: FlatListProps<ItemT>['renderItem'];
  style?: StyleProp<ViewStyle>;
}

const CommandList = React.forwardRef(
  <ItemT,>(
    { data, renderItem, style, ...props }: CommandListProps<ItemT>,
    ref: React.Ref<FlatList<ItemT>>
  ) => (
    <FlatList
      ref={ref}
      data={data}
      renderItem={renderItem}
      style={[styles.list, style]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyExtractor={(_, index) => index.toString()}
      {...props}
    />
  )
);

CommandList.displayName = 'CommandList';

interface CommandEmptyProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const CommandEmpty = ({ children, style }: CommandEmptyProps) => (
  <View style={[styles.empty, style]}>
    <Text style={styles.emptyText}>
      {children || 'No hay resultados'}
    </Text>
  </View>
);

interface CommandGroupProps extends ViewProps {
  heading?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const CommandGroup = React.forwardRef<View, CommandGroupProps>(
  ({ heading, children, style, ...props }, ref) => (
    <View ref={ref} style={[styles.group, style]} {...props}>
      {heading && <Text style={styles.groupHeading}>{heading}</Text>}
      <View style={styles.groupContent}>{children}</View>
    </View>
  )
);

CommandGroup.displayName = 'CommandGroup';

const CommandSeparator = ({ style }: { style?: StyleProp<ViewStyle> }) => (
  <View style={[styles.separator, style]} />
);

interface CommandItemProps extends TouchableOpacityProps {
  children: ReactNode;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
}

const CommandItem = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  CommandItemProps
>(({ children, selected = false, style, ...props }, ref) => (
  <TouchableOpacity
    ref={ref}
    style={[
      styles.item,
      selected && styles.itemSelected,
      style,
    ]}
    activeOpacity={0.7}
    {...props}
  >
    {children}
  </TouchableOpacity>
));

CommandItem.displayName = 'CommandItem';

interface CommandShortcutProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

const CommandShortcut = ({ children, style }: CommandShortcutProps) => (
  <Text style={[styles.shortcut, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  command: {
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  commandDialog: {
    flex: 1,
  },
  dialogContent: {
    padding: 0,
    margin: 0,
    borderRadius: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#111827',
  },
  list: {
    flex: 1,
    maxHeight: 300,
  },
  empty: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
  },
  group: {
    padding: 4,
  },
  groupHeading: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  groupContent: {
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  item: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemSelected: {
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  shortcut: {
    marginLeft: 'auto',
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: 0.5,
  },
});

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
};
export default function _Component() { return null; }
