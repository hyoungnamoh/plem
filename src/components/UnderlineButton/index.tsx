import { StyleSheet, TextProps } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import PlemButton, { PlemButtonProps } from 'components/Atoms/PlemButton';

const UnderlineButton = (props: TextProps & Pick<PlemButtonProps, 'onPress'>) => {
  return (
    <PlemButton onPress={props.onPress}>
      <PlemText {...props} style={[styles.underlineText, props.style]}>
        {props.children}
      </PlemText>
    </PlemButton>
  );
};

const styles = StyleSheet.create({
  underlineText: { textDecorationLine: 'underline' },
});

export default UnderlineButton;
