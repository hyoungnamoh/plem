import { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import { useQuery, useQueryClient } from 'react-query';
import { ApiResponse } from '../../../types/axios';
import { PlanChart } from '../../../types/chart';
import { getPlanChartList } from '../../api/charts/getPlanChartListApi';
import PlemText from '../../components/Atoms/PlemText';
import { MAIN_COLOR } from '../../constants/colors';
import ChartList from './ChartList';
import DraggableChartList from './DraggableChartList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PlanChartListTabStackParamList } from '../../tabs/PlanChartListTab';
import AddChartButton from './AddChartButton';
import { useFocusEffect } from '@react-navigation/native';
import { bottomSafeAreaState } from '../../states/bottomSafeAreaState';
import { useRecoilState } from 'recoil';

const surprisedPlemImage = require('../../assets/images/surprised_plem.png');

type PlanChartListPageProps = NativeStackScreenProps<PlanChartListTabStackParamList, 'PlanChartListPage'>;

const PlanChartListPage = ({ navigation }: PlanChartListPageProps) => {
  const [bottomSafeArea, setBottomSafeArea] = useRecoilState(bottomSafeAreaState);
  const { data, status } = useQuery<ApiResponse<PlanChart[]>>({
    queryKey: ['chartList'],
    queryFn: getPlanChartList,
  });
  const [charts, setCharts] = useState<PlanChart[]>(data?.data || []);
  const [isEditing, setIsEditing] = useState(false);
  const isEmpty = charts && charts.length < 1;

  useEffect(() => {
    if (status === 'success') {
      setCharts(data.data);
    }
  }, [status, data]);

  useFocusEffect(() => {
    if (bottomSafeArea === MAIN_COLOR) {
      return;
    }
    setBottomSafeArea(MAIN_COLOR);
  });

  const onPressEditComplete = () => {
    setIsEditing(false);
  };

  const onPressEdit = () => {
    setIsEditing(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: MAIN_COLOR }}>
      <View style={styles.header}>
        <PlemText style={{ fontSize: 24 }}>나의 계획표</PlemText>
        <Pressable disabled={isEmpty} onPress={isEditing ? onPressEditComplete : onPressEdit}>
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
        <View style={styles.emptyWrap}>
          <Image source={surprisedPlemImage} />
          <PlemText style={styles.emptyText}>만들어진 계획표가 없어요.</PlemText>
          <AddChartButton />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
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
  emptyWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '60%',
  },
  emptyText: {
    fontSize: 14,
    color: '#888888',
    marginTop: 20,
  },
});

export default PlanChartListPage;
