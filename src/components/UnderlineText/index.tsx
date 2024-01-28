import { forwardRef } from 'react';
import { Image, StyleSheet, TextProps, View, ViewProps } from 'react-native';
import PlemText from 'components/Atoms/PlemText';

export type UnderlineTextProps = { wrapperProps?: ViewProps; isInvalidValue?: boolean } & TextProps;

const UnderlineText = forwardRef<HTMLInputElement, UnderlineTextProps>((props, ref) => {
  return (
    <View {...props.wrapperProps}>
      <PlemText {...props} />
      <Image
        source={require('../../assets/images/underline.png')}
        style={[styles.underline, { tintColor: props.isInvalidValue ? '#E40C0C' : '#000' }]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  underline: {
    marginTop: 12,
    width: '100%',
  },
});

export default UnderlineText;
