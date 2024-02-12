import { StyleSheet } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import { PlanChartListTabStackParamList } from 'tabs/PlanChartListTab';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import PlemButton from 'components/Atoms/PlemButton';

const AddChartButton = () => {
  const navigation = useNavigation<NavigationProp<PlanChartListTabStackParamList>>();
  const onPressAddChart = () => {
    navigation.navigate('AddChartPage');
  };

  return (
    <PlemButton style={styles.addChartButton} onPress={onPressAddChart}>
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
