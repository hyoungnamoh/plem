import { Constructor, NativeMethods, Text, TextComponent, TextProps } from 'react-native';

const PlemText = (props: TextProps) => {
  return (
    <Text {...props} style={[props.style, { fontFamily: 'LeeSeoyun' }]}>
      {props.children}
    </Text>
  );
};

export default PlemText;
