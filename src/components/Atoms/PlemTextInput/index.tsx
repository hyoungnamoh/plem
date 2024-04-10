import { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';

const PlemTextInput = forwardRef<TextInput, TextInputProps>((props, ref) => {
  return (
    <TextInput
      {...props}
      style={[{ fontFamily: 'AaGongCatPen', fontSize: 18 }, props.style]}
      ref={ref}
      placeholderTextColor="#AAAAAA">
      {props.children}
    </TextInput>
  );
});

export default PlemTextInput;
