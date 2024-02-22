import { forwardRef } from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';

export type PlemTextProps = TextProps;

const PlemText = forwardRef<Text, TextProps>((props, ref) => {
  const propStyle = props.style as TextStyle | undefined;
  const lineHeight = propStyle?.lineHeight || 1;
  const fontSize = propStyle?.fontSize || 18;

  return (
    <Text {...props} style={[styles.plemText, props.style, { lineHeight: lineHeight * fontSize }]}>
      {props.children}
    </Text>
  );
});

const styles = StyleSheet.create({
  plemText: {
    fontFamily: 'LeeSeoyun',
    fontSize: 18,
  },
});

export default PlemText;
