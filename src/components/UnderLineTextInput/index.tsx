import { Image, StyleSheet, TextInputProps, View, ViewProps } from 'react-native';
import PlemTextInput from '../Atoms/PlemTextInput';

type UnderlineTextInputProps = TextInputProps & { wrapperProps?: ViewProps; isInvalidValue?: boolean };

const UnderlineTextInput = (props: UnderlineTextInputProps) => {
  return (
    <View {...props.wrapperProps}>
      <PlemTextInput {...props} />
      <Image
        source={require('../../assets/images/underline.png')}
        style={[styles.underline, { tintColor: props.isInvalidValue ? '#E40C0C' : '#000' }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  underline: {
    marginTop: 12,
    width: '100%',
  },
});

export default UnderlineTextInput;
