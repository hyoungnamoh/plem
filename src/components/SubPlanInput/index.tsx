import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRecoilState } from 'recoil';
import { addPlanChartState } from 'states/addPlanChartState';
import PlemTextInput from 'components/Atoms/PlemTextInput';
import UncheckedSvg from 'assets/images/unchecked_black_24x24.svg';
import PlemButton from 'components/Atoms/PlemButton';

const SubPlanInput = ({
  planIndex,
  saveSubPlan,
}: {
  planIndex: number;
  saveSubPlan: (args: { planIndex: number; subPlanName: string }) => void;
}) => {
  const [chart, setChart] = useRecoilState(addPlanChartState);

  const [subPlan, setSubPlan] = useState('');

  const onEndEditingSubPlan = ({ targetPlanIndex, subPlanName }: { targetPlanIndex: number; subPlanName: string }) => {
    saveSubPlan({ planIndex: targetPlanIndex, subPlanName });
    setSubPlan('');
  };

  return (
    <PlemButton style={styles.subPlan}>
      <UncheckedSvg />
      <PlemTextInput
        value={subPlan}
        onChangeText={setSubPlan}
        style={{ marginLeft: 4 }}
        placeholder={'할 일 추가하기'}
        returnKeyType={'done'}
        onSubmitEditing={() => onEndEditingSubPlan({ targetPlanIndex: planIndex, subPlanName: subPlan })}
      />
    </PlemButton>
  );
};

const styles = StyleSheet.create({
  subPlan: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
});

export default SubPlanInput;
