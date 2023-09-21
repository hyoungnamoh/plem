import { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';

const PlemTextInput = forwardRef<TextInput, TextInputProps>((props, ref) => {
  return (
    <TextInput {...props} style={[props.style, { fontFamily: 'LeeSeoyun', fontSize: 18 }]} ref={ref}>
      {props.children}
    </TextInput>
  );
});

export default PlemTextInput;
