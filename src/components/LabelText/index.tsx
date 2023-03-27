import { StyleSheet, View } from 'react-native';
import PlemText from '../Atoms/PlemText';
import UnderlineText, { UnderlineTextProps } from '../UnderlineText';

type LabelTextProps = {
  label: string;
} & UnderlineTextProps;

const LabelText = (props: LabelTextProps) => {
  const { label } = props;
  return (
    <View>
      <PlemText style={styles.label}>{label}</PlemText>
      <UnderlineText {...props} style={[styles.underlineText, props.style]} />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
  },
  underlineText: { marginTop: 12 },
});

export default LabelText;
