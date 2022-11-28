import { StyleSheet, Text, TextProps } from 'react-native';

const PlemText = (props: TextProps) => {
  return (
    <Text {...props} style={[styles.plemText, props.style]}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  plemText: { fontFamily: 'LeeSeoyun', fontSize: 18 },
});

export default PlemText;
