import { cloneDeep } from 'lodash';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useRecoilState } from 'recoil';
import { addPlanChartState } from '../../states/addPlanChartState';
import PlemTextInput from '../Atoms/PlemTextInput';

const uncheckedImage = require('../../assets/images/unchecked_black.png');

const SubPlanInput = ({ planIndex }: { planIndex: number }) => {
  const [chart, setChart] = useRecoilState(addPlanChartState);

  const [subPlan, setSubPlan] = useState('');

  const onEndEditingSubPlan = ({ planIndex, subPlanName }: { planIndex: number; subPlanName: string }) => {
    const copiedChart = cloneDeep(chart);
    copiedChart.plans[planIndex].subPlans = [...copiedChart.plans[planIndex].subPlans, { name: subPlanName }];
    setChart(copiedChart);
    setSubPlan('');
  };

  return (
    <Pressable style={styles.subPlan}>
      <Image source={uncheckedImage} />
      <PlemTextInput
        value={subPlan}
        onChangeText={setSubPlan}
        style={{ marginLeft: 4 }}
        placeholder={'할 일 추가하기'}
        returnKeyType={'done'}
        onSubmitEditing={() => onEndEditingSubPlan({ planIndex, subPlanName: subPlan })}
      />
    </Pressable>
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
