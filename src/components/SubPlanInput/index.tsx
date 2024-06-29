import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import PlemTextInput from 'components/Atoms/PlemTextInput';
import UncheckedSvg from 'assets/images/unchecked_black_24x24.svg';
import AddButtonSvg from 'assets/images/add_sub_plan_24x24.svg';
import PlemButton from 'components/Atoms/PlemButton';

const SubPlanInput = ({
  planIndex,
  saveSubPlan,
}: {
  planIndex: number;
  saveSubPlan: (args: { planIndex: number; subPlanName: string }) => void;
}) => {
  const [subPlan, setSubPlan] = useState('');

  const onEndEditingSubPlan = ({ targetPlanIndex, subPlanName }: { targetPlanIndex: number; subPlanName: string }) => {
    if (!subPlanName) {
      Alert.alert('할 일을 입력해주세요.');
      return;
    }
    saveSubPlan({ planIndex: targetPlanIndex, subPlanName });
    setSubPlan('');
  };

  return (
    <View style={styles.subPlanRow}>
      <View style={{ flexDirection: 'row' }}>
        <UncheckedSvg />
        <PlemTextInput
          value={subPlan}
          onChangeText={setSubPlan}
          style={{ marginLeft: 4, width: '80%' }}
          placeholder={'할 일 추가하기'}
          returnKeyType={'done'}
          maxLength={30}
          onSubmitEditing={() => onEndEditingSubPlan({ targetPlanIndex: planIndex, subPlanName: subPlan })}
        />
      </View>
      {subPlan && (
        <PlemButton onPress={() => onEndEditingSubPlan({ targetPlanIndex: planIndex, subPlanName: subPlan })}>
          <AddButtonSvg />
        </PlemButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  subPlanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
});

export default SubPlanInput;
