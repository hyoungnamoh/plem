import { forwardRef } from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';

export type PlemTextProps = TextProps;

const PlemText = forwardRef<Text, TextProps>((props, ref) => {
  const propStyle = props.style as TextStyle | undefined;
  const fontSize = propStyle?.fontSize || 18;
  const lineHeight = propStyle?.lineHeight ? propStyle?.lineHeight * fontSize : undefined;

  return (
    <Text {...props} style={[styles.plemText, props.style, { lineHeight }]}>
      {props.children}
    </Text>
  );
});

const styles = StyleSheet.create({
  plemText: {
    fontFamily: 'AaGongCatPen',
    fontSize: 18,
  },
});

export default PlemText;
