import { TextInput, TextInputProps } from 'react-native';

const PlemTextInput = (props: TextInputProps) => {
  return (
    <TextInput {...props} style={[props.style, { fontFamily: 'LeeSeoyun' }]}>
      {props.children}
    </TextInput>
  );
};

export default PlemTextInput;
