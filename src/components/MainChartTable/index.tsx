import { View, StyleSheet } from 'react-native';
import { PlanChart } from 'types/chart';
import PlemText from './../Atoms/PlemText';
import dayjs from 'dayjs';
import { usePieChart } from 'hooks/usePieChart';
import SurprisedPlemmonSvg from 'assets/images/surprised_plemmon_39x44.svg';
import { SAMPLE_EMPTY_CHART } from './constants';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'constants/etc';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabStackParamList } from 'tabs/MainTab';
import PlemButton from 'components/Atoms/PlemButton';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { PieChart } from 'components/PieChart';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = SCREEN_WIDTH;
const screenHight = SCREEN_HEIGHT;
const chartRadius = SCREEN_WIDTH / 2.65;

const MainChartTable = ({
  chart,
  navigation,
  isMaximumChartList,
  setOpenMaximumAlert,
}: {
  chart: PlanChart | null;
  navigation: NativeStackNavigationProp<MainTabStackParamList, 'MainPage', undefined>;
  isMaximumChartList: boolean;
  setOpenMaximumAlert: Dispatch<SetStateAction<boolean>>;
}) => {
  const hasTodayChart = !!chart;
  const chartData = chart || SAMPLE_EMPTY_CHART;
  const { pieChartData, initialAngle, currentTimeDegree } = usePieChart({
    chart: chartData,
    renderCurrentTime: !!chart,
  });

  useEffect(() => {}, []);

  const handleChartPress = () => {
    if (chart) {
      navigation.navigate('AddChartPage', { chart });
    } else {
      if (isMaximumChartList) {
        setOpenMaximumAlert(true);
        return;
      }
      navigation.navigate('AddChartPage');
    }
  };

  const handleTextDragEnd = async ({ id, x, y }: { id: string; x: number; y: number }) => {
    const storagePlanCoordinates = await AsyncStorage.getItem('planCoordinates');
    if (!storagePlanCoordinates) {
      AsyncStorage.setItem('planCoordinates', JSON.stringify({ [id]: { x, y } }));
    } else {
      const planCoordinates = JSON.parse(storagePlanCoordinates) as { [id: string]: { x: number; y: number } };
      planCoordinates[id] = { x, y };
      AsyncStorage.setItem('planCoordinates', JSON.stringify(planCoordinates));
    }
  };

  return (
    <PlemButton onPress={handleChartPress}>
      <View style={[styles.wrapper, { opacity: hasTodayChart ? 1 : 0.3 }]}>
        <View>
          <View style={styles.container}>
            <View style={styles.labelCell}>
              <PlemText>Date</PlemText>
            </View>
            <View style={styles.valueCell}>
              <PlemText>{hasTodayChart ? dayjs().format('YYYY.MM.DD') : 'Wonderful day .. *'}</PlemText>
            </View>
          </View>
          <View style={[styles.container, { borderTopWidth: 0, borderBottomWidth: 0 }]}>
            <View style={styles.labelCell}>
              <PlemText>Title</PlemText>
            </View>
            <View style={styles.valueCell}>
              <PlemText>{chartData.name}</PlemText>
            </View>
          </View>
          <View style={styles.chartBox}>
            <PlemText style={[styles.baseTimes, { top: 8 }]}>24</PlemText>
            <PlemText style={[styles.baseTimes, { right: 8 }]}>6</PlemText>
            <PlemText style={[styles.baseTimes, { bottom: 8 }]}>12</PlemText>
            <PlemText style={[styles.baseTimes, { left: 8 }]}>18</PlemText>
            <PieChart
              data={pieChartData}
              initialAngle={initialAngle}
              showText={true}
              textColor={'#000'}
              labelsPosition={'outward'}
              textSize={14}
              font={'LeeSeoyun'}
              strokeColor={'black'}
              strokeWidth={2}
              radius={chartRadius}
              onPress={handleChartPress}
            />
            {hasTodayChart && (
              <View
                style={[
                  styles.currentTimeBar,
                  {
                    transform: [
                      { translateY: chartRadius / 2 },
                      { rotate: `${currentTimeDegree}deg` },
                      { translateY: -(chartRadius / 2) },
                    ],
                  },
                ]}
              />
            )}
          </View>
        </View>
      </View>
      {!hasTodayChart && (
        <View style={styles.todayPlanEmptyWrap}>
          <SurprisedPlemmonSvg />
          <PlemText style={styles.todayPlanEmptyText}>계획표를 등록해 주세요.</PlemText>
        </View>
      )}
    </PlemButton>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  container: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#000',
  },
  labelCell: {
    justifyContent: 'center',
    alignItems: 'center',
    width: (screenWidth - 30) * 0.19,
    height: screenHight * 0.5 * 0.077,
    borderRightWidth: 2,
    borderColor: '#000',
  },
  valueCell: {
    justifyContent: 'center',
    width: 285,
    height: screenHight * 0.5 * 0.077,
    paddingHorizontal: 10,
  },
  baseTimes: {
    position: 'absolute',
    color: '#AAAAAA',
  },
  currentTimeBar: {
    backgroundColor: '#FFE600',
    width: 2,
    height: chartRadius * 0.75,
    position: 'absolute',
    marginTop: '10%',
    top: 0,
  },
  chartBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: '#000',
    // padding: 16,
  },
  todayPlanEmptyWrap: {
    position: 'absolute',
    alignSelf: 'center',
    top: '45%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayPlanEmptyText: {
    fontSize: 14,
    marginTop: 20,
  },
});

export default MainChartTable;
