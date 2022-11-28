import { TextInput, TextInputProps } from 'react-native';

const PlemTextInput = (props: TextInputProps) => {
  return (
    <TextInput {...props} style={[props.style, { fontFamily: 'LeeSeoyun', fontSize: 18 }]}>
      {props.children}
    </TextInput>
  );
};

export default PlemTextInput;
