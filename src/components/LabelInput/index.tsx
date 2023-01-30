import { StyleSheet, View } from 'react-native';
import PlemText from '../Atoms/PlemText';
import UnderlineTextInput, { UnderlineTextInputProps } from '../UnderlineTextInput';

type LabelInputProps = {
  label: string;
} & UnderlineTextInputProps;

const LabelInput = (props: LabelInputProps) => {
  const { label } = props;
  return (
    <View>
      <PlemText style={styles.label}>{label}</PlemText>
      <UnderlineTextInput {...props} style={{ marginTop: 12 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
  },
});

export default LabelInput;
