import { StyleSheet, TextInputProps, View, ViewProps } from 'react-native';
import PlemTextInput from 'components/Atoms/PlemTextInput';
import UnderlineSvg from 'assets/images/underline.svg';

export type UnderlineTextInputProps = TextInputProps & { wrapperProps?: ViewProps; isInvalidValue?: boolean };

const UnderlineTextInput = (props: UnderlineTextInputProps) => {
  return (
    <View {...props.wrapperProps}>
      <PlemTextInput {...props} style={[props.style, props.isInvalidValue && styles.invalidColor]} />
      <UnderlineSvg
        preserveAspectRatio="none"
        width={'100%'}
        stroke={props.isInvalidValue ? '#E40C0C' : '#000'}
        style={styles.underline}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  underline: {
    marginTop: 12,
    width: '100%',
  },
  invalidColor: {
    color: '#E40C0C',
  },
});

export default UnderlineTextInput;
