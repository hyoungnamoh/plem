import { StyleSheet } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import PlemButton from 'components/Atoms/PlemButton';

const AddChartButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <PlemButton style={styles.addChartButton} onPress={onPress}>
      <PlemText>계획표 작성</PlemText>
    </PlemButton>
  );
};

const styles = StyleSheet.create({
  addChartButton: {
    width: 126,
    height: 36,
    borderRadius: 18,
    borderColor: '#000',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default AddChartButton;
