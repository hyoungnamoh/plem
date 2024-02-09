import { StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import UnderlineTextInput, { UnderlineTextInputProps } from 'components/UnderlineTextInput';

type LabelInputProps = {
  label: string;
} & UnderlineTextInputProps;

const LabelInput = (props: LabelInputProps) => {
  const { label, isInvalidValue } = props;
  return (
    <View>
      <PlemText style={[styles.label, isInvalidValue && styles.invalidColor]}>{label}</PlemText>
      <UnderlineTextInput {...props} style={[styles.underlineInput, props.style]} />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
  },
  invalidColor: {
    color: '#E40C0C',
  },
  underlineInput: { marginTop: 12 },
});

export default LabelInput;
