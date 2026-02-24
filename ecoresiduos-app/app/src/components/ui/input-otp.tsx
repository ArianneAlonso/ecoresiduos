import React, { useRef } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native'
import { Dot } from 'lucide-react-native'

interface InputOTPProps {
  length?: number
  value: string
  onChange: (value: string) => void
}

const InputOTP = ({ length = 6, value, onChange }: InputOTPProps) => {
  const inputs = useRef<Array<TextInput | null>>([])

  const handleChange = (text: string, index: number) => {
    const newValue = value.split('')
    newValue[index] = text
    const finalValue = newValue.join('').slice(0, length)
    onChange(finalValue)

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputs.current[index] = ref
          }}
          style={[
            styles.input,
            value[index] && styles.inputFilled,
          ]}
          keyboardType="number-pad"
          maxLength={1}
          value={value[index] ?? ''}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          textAlign="center"
        />
      ))}
    </View>
  )
}

const InputOTPSeparator = () => (
  <View style={styles.separator}>
    <Dot size={16} color="#9ca3af" />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    marginHorizontal: 4,
    fontSize: 20,
    fontWeight: '600',
  },
  inputFilled: {
    borderColor: '#1f5c2e',
  },
  separator: {
    justifyContent: 'center',
    marginHorizontal: 4,
  },
})

export { InputOTP, InputOTPSeparator }
export default function _Component() { return null; }
