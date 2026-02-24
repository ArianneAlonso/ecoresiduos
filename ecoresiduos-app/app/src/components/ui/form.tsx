import React, { createContext, useContext, ReactNode, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { Label } from './label';

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue | undefined>(
  undefined
);

const FormItemContext = createContext<{ id: string } | undefined>(
  undefined
);

const FormField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>(
  props: ControllerProps<TFieldValues, TName>
) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const FormItem = React.forwardRef<
  React.ElementRef<typeof View>,
  { children: ReactNode; style?: any }
>(({ children, style, ...props }, ref) => {
  const idRef = useRef(`form-item-${Math.random().toString(36).slice(2)}`);

  return (
    <FormItemContext.Provider value={{ id: idRef.current }}>
      <View ref={ref} style={[styles.item, style]} {...props}>
        {children}
      </View>
    </FormItemContext.Provider>
  );
});

FormItem.displayName = 'FormItem';

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error('useFormField must be used inside <FormField>');
  }

  if (!itemContext) {
    throw new Error('useFormField must be used inside <FormItem>');
  }

  const fieldState = getFieldState(fieldContext.name, formState);

  return {
    id: itemContext.id,
    name: fieldContext.name,
    ...fieldState,
  };
};

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Text>,
  { children: ReactNode; style?: any }
>(({ children, style, ...props }, ref) => {
  const { error } = useFormField();

  return (
    <Label
      ref={ref as any}
      style={[styles.label, error && styles.labelError, style]}
      {...props}
    >
      {children}
    </Label>
  );
});

FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  React.ElementRef<typeof View>,
  { children: ReactNode; style?: any }
>(({ children, style, ...props }, ref) => {
  const { error } = useFormField();

  return (
    <View
      ref={ref}
      style={[styles.control, error && styles.controlError, style]}
      {...props}
    >
      {children}
    </View>
  );
});

FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  React.ElementRef<typeof Text>,
  { children: ReactNode; style?: any }
>(({ children, style, ...props }, ref) => (
  <Text
    ref={ref}
    style={[styles.description, style]}
    {...props}
  >
    {children}
  </Text>
));

FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  React.ElementRef<typeof Text>,
  { children?: ReactNode; style?: any }
>(({ children, style, ...props }, ref) => {
  const { error } = useFormField();
  const message = error?.message ?? children;

  if (!message) return null;

  return (
    <Text
      ref={ref}
      style={[styles.message, style]}
      {...props}
    >
      {String(message)}
    </Text>
  );
});

FormMessage.displayName = 'FormMessage';

const Form = FormProvider;

const styles = StyleSheet.create({
  item: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  labelError: {
    color: '#ef4444',
  },
  control: {
    minHeight: 44,
  },
  controlError: {
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  message: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ef4444',
    marginTop: 4,
  },
});

export {
  useFormField,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
};
export default function _Component() { return null; }
