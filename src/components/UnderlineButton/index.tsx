import { Pressable, PressableProps, StyleSheet, TextProps } from 'react-native';
import PlemText from '../Atoms/PlemText';

const UnderlineButton = (props: TextProps & Pick<PressableProps, 'onPress'>) => {
  return (
    <Pressable onPress={props.onPress}>
      <PlemText {...props} style={[styles.underlineText, props.style]}>
        {props.children}
      </PlemText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  underlineText: { textDecorationLine: 'underline' },
});

export default UnderlineButton;
