import { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import { useQuery, useQueryClient } from 'react-query';
import { ApiResponse } from '../../../types/axios';
import { PlanChart } from '../../../types/chart';
import { getPlanChartList } from '../../api/charts/getPlanChartList';
import PlemText from '../../components/Atoms/PlemText';
import { MAIN_COLOR } from '../../constants/color';
import ChartList from './ChartList';
import DraggableChartList from './DraggableChartList';

const surprisedPlemImage = require('../../assets/images/surprised_plem.png');

const PlanChartListPage = () => {
  const queryClient = useQueryClient();
  const { isLoading, data, isError, status } = useQuery<ApiResponse<PlanChart[]>>({
    queryKey: ['chartList'],
    queryFn: getPlanChartList,
  });
  const [charts, setCharts] = useState<PlanChart[]>(data?.data || []);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (status === 'success') {
      setCharts(data.data);
    }
  }, [status, data]);

  const accordionData = charts.map((chart) => {
    return { title: chart.name };
  });
  const isEmpty = charts && charts.length < 1;

  const editComplete = () => {
    setIsEditing(false);
  };

  const edit = () => {
    setIsEditing(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: MAIN_COLOR }}>
      {/* <Loading /> */}
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 18 }}>
        <PlemText style={{ fontSize: 24 }}>나의 계획표</PlemText>
        <Pressable disabled={isEmpty} onPress={isEditing ? editComplete : edit}>
          <PlemText style={{ fontSize: 20, color: isEmpty ? '#AAAAAA' : '#000' }}>
            {isEditing ? '완료' : '편집'}
          </PlemText>
        </Pressable>
      </View>
      {charts.length > 0 ? (
        isEditing ? (
          <DraggableChartList charts={charts} setCharts={setCharts} />
        ) : (
          <ChartList list={charts} />
        )
      ) : (
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '60%' }}>
          <Image source={surprisedPlemImage} />
          <PlemText style={{ fontSize: 14, color: '#888888', marginTop: 20 }}>만들어진 계획표가 없어요.</PlemText>
          <Pressable
            style={{
              width: 126,
              height: 36,
              borderRadius: 18,
              borderColor: '#000',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <PlemText>계획표 작성</PlemText>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerLine: {
    width: Dimensions.get('screen').width,
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 16,
  },
  date: {
    color: '#888888',
    fontSize: 14,
    marginTop: 8,
  },
});
export default PlanChartListPage;
