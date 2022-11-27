import { Image, TextInputProps, View, ViewProps } from 'react-native';
import PlemTextInput from '../Atoms/PlemTextInput';

type UnderlineTextInputProps = TextInputProps & { wrapperProps?: ViewProps };
const UnderlineTextInput = (props: UnderlineTextInputProps) => {
  return (
    <View {...props.wrapperProps}>
      <PlemTextInput {...props} />
      <Image source={require('../../assets/images/underline.png')} style={{ marginTop: 12 }} />
    </View>
  );
};

export default UnderlineTextInput;
