import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PlanChart } from 'types/chart';
import PlemText from 'components/Atoms/PlemText';
import { MAIN_COLOR } from 'constants/colors';
import ChartList from './ChartList';
import DraggableChartList from './DraggableChartList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PlanChartListTabStackParamList } from 'tabs/PlanChartListTab';
import AddChartButton from './AddChartButton';
import SurprisedPlemmonSvg from 'assets/images/surprised_plemmon_39x44.svg';
import PlemButton from 'components/Atoms/PlemButton';
import { useGetChartList } from 'hooks/queries/useGetChartList';
import MaximumChartAlert from 'components/MaximumChartAlert';
import { NUM_OF_MAXIMUM_CHART } from 'constants/numOfMaximumChart';
import UnderlineSvg from 'assets/images/underline.svg';
import { useSetRecoilState } from 'recoil';
import { hideBottomTabBarState } from 'states/hideBottomTabBarState';
import { logEvent } from 'helper/analytics';

type PlanChartListPageProps = NativeStackScreenProps<PlanChartListTabStackParamList, 'PlanChartListPage'>;

const PlanChartListPage = ({ navigation }: PlanChartListPageProps) => {
  const { data, status } = useGetChartList();
  const setHideBottomTabBar = useSetRecoilState(hideBottomTabBarState);
  const [charts, setCharts] = useState<PlanChart[]>(data?.data || []);
  const [isEditing, setIsEditing] = useState(false);
  const [openMaximumAlert, setOpenMaximumAlert] = useState(false);
  const isEmpty = charts && charts.length < 1;

  useEffect(() => {
    if (status === 'success') {
      setCharts(data.data);
    }
  }, [status, data]);

  const handleEditComplete = () => {
    setIsEditing(false);
    setHideBottomTabBar(false);
  };

  const handleEdit = () => {
    logEvent('PlanChartListPage_editChartList');
    setIsEditing(true);
    setHideBottomTabBar(true);
  };

  const handleAddChart = () => {
    if (isChartListMaximum()) {
      setOpenMaximumAlert(true);
    } else {
      navigation.navigate('AddChartPage');
    }
  };

  const isChartListMaximum = () => {
    return charts.length >= NUM_OF_MAXIMUM_CHART;
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: MAIN_COLOR }}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <PlemText style={{ fontSize: 24 }}>나의 계획표 </PlemText>
            <PlemText style={{ color: '#AAAAAA' }}>
              {charts.length}/{NUM_OF_MAXIMUM_CHART}
            </PlemText>
          </View>
          <PlemButton disabled={isEmpty} onPress={isEditing ? handleEditComplete : handleEdit}>
            <PlemText style={{ fontSize: 20, color: isEmpty ? '#AAAAAA' : '#000' }}>
              {isEditing ? '완료' : '편집'}
            </PlemText>
          </PlemButton>
        </View>
        <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#CCCCCC'} />
        {charts.length > 0 ? (
          // ChartList header부분(usePieChart) useEffect 부분 성능 문제로 컴포넌트가 언마운트 되지 않도록 임시 조치
          <>
            <View style={{ height: isEditing ? '100%' : 0 }}>
              <DraggableChartList
                charts={charts}
                setCharts={setCharts}
                isChartListMaximum={isChartListMaximum()}
                setOpenMaximumAlert={setOpenMaximumAlert}
                handleEditComplete={handleEditComplete}
              />
            </View>
            <View style={{ height: isEditing ? 0 : '100%' }}>
              <ChartList list={charts} onPressAddChart={handleAddChart} />
            </View>
          </>
        ) : (
          <View style={styles.emptyWrap}>
            <SurprisedPlemmonSvg />
            <PlemText style={styles.emptyText}>만들어진 계획표가 없어요.</PlemText>
            <AddChartButton onPress={handleAddChart} />
          </View>
        )}
      </View>
      <MaximumChartAlert
        open={openMaximumAlert}
        onCancel={() => setOpenMaximumAlert(false)}
        onConfirm={() => setOpenMaximumAlert(false)}
        cancelText="나중에 할게요"
        confirmText="정리하러 갈래요"
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 18,
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
