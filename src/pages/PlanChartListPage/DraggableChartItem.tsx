import { Alert, StyleSheet, View } from 'react-native';
import { PlanChart } from 'types/chart';
import PlemText from 'components/Atoms/PlemText';
import { useCloneChart } from 'hooks/mutations/useCloneChart';
import { useDeleteChart } from 'hooks/mutations/useDeleteChart';
import HamburgerBarSvg from 'assets/images/hamburgerbar_32x32.svg';
import { usePieChart } from 'hooks/usePieChart';
import { SCREEN_WIDTH } from 'constants/etc';
import PlemButton from 'components/Atoms/PlemButton';
import { Dispatch, SetStateAction } from 'react';
import UnderlineSvg from 'assets/images/underline.svg';
import { PieChart } from 'components/PieChart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MAIN_COLOR } from 'constants/colors';
import { CHART_RADIUS, STROKE_WIDTH } from './constants';
import analytics from '@react-native-firebase/analytics';

const DraggableChartItem = ({
  item,
  drag,
  onDeleteUpdate,
  onCloneUpdate,
  isChartListMaximum,
  setOpenMaximumAlert,
}: {
  item: PlanChart;
  drag: () => void;
  onDeleteUpdate: ({ id }: { id: number }) => void;
  onCloneUpdate: ({ newItem }: { newItem: PlanChart; originId: number }) => void;
  isChartListMaximum: boolean;
  setOpenMaximumAlert: Dispatch<SetStateAction<boolean>>;
}) => {
  const { pieChartData, initialAngle } = usePieChart({ chart: item, hideName: true });

  const { mutate: cloneChart } = useCloneChart({
    onSuccess: ({ data }) => {
      onCloneUpdate({ newItem: data, originId: item.id });
    },
  });

  const { mutate: deleteChart } = useDeleteChart({
    onSuccess: ({ success, data }, { id }) => {
      if (!success) {
        Alert.alert(data);
        return;
      }
      onDeleteUpdate({ id });
    },
  });

  const handleClonePress = (id: number) => {
    analytics().logEvent('PlanChartListPage_cloneChartButtonClick');
    cloneChart({ id });
  };

  const handleDeletePress = (id: number) => {
    analytics().logEvent('PlanChartListPage_deleteChartButtonClick');
    deleteChart({ id });
    clearStorageChartCoordinates(item);
  };

  const clearStorageChartCoordinates = async (chartData: PlanChart) => {
    const storagePlanCoordinates = await AsyncStorage.getItem('planCoordinates');
    if (!storagePlanCoordinates) {
      return;
    }
    const parsedPlanCoordinates = JSON.parse(storagePlanCoordinates);
    const tmpeIdList = chartData.plans.map((plan) => plan.tempId);
    tmpeIdList.forEach(async (id) => {
      if (!id) {
        return;
      }
      delete parsedPlanCoordinates[id];
    });
    AsyncStorage.setItem('planCoordinates', JSON.stringify(parsedPlanCoordinates));
  };

  return (
    <>
      <View style={styles.wrap}>
        <View style={styles.contentContainer}>
          <PlemButton onPressIn={drag} style={{ marginRight: 16 }}>
            <HamburgerBarSvg />
          </PlemButton>
          <View style={{ width: CHART_RADIUS * 2 + STROKE_WIDTH, height: CHART_RADIUS * 2 + STROKE_WIDTH }}>
            <PieChart
              data={pieChartData}
              initialAngle={initialAngle}
              textColor={'#000'}
              labelsPosition={'outward'}
              textSize={14}
              font={'AaGongCatPen'}
              strokeColor={'black'}
              strokeWidth={STROKE_WIDTH}
              radius={CHART_RADIUS}
            />
          </View>
          <View style={styles.chartNameWrap}>
            <PlemText style={styles.chartName} numberOfLines={2}>
              {item.name}
            </PlemText>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <PlemButton
            style={styles.cloneButton}
            hitSlop={8}
            onPress={() => handleClonePress(item.id)}
            disabled={isChartListMaximum}>
            <PlemText style={[styles.cloneText, isChartListMaximum && styles.disabledCloen]}>복사</PlemText>
          </PlemButton>
          <PlemButton style={styles.removeButton} hitSlop={8} onPress={() => handleDeletePress(item.id)}>
            <PlemText style={styles.removeText}>삭제</PlemText>
          </PlemButton>
        </View>
      </View>
      <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#CCCCCC'} />
    </>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: MAIN_COLOR,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartNameWrap: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  chartName: {
    width: SCREEN_WIDTH - 260,
  },
  removeButton: {
    width: 40,
    marginLeft: 16,
  },
  cloneButton: {
    width: 40,
  },
  cloneText: {
    fontSize: 16,
  },
  removeText: {
    fontSize: 16,
    color: '#E40C0C',
  },
  disabledCloen: {
    color: '#CCCCCC',
  },
});

export default DraggableChartItem;
