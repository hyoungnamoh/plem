import { View, Text, StyleSheet, createElement } from 'react-native';
import PlanGrid from '../assets/images/plan_grid.svg';
import DoughnutChart from '../assets/images/doughnut_chart.svg';
import Svg, { Circle, G, Path } from 'react-native-svg';
import PlanChartSVG from './PlanChartSVG';

type CategoryStatisticData = { percentage: number; category: string };
const MainSVGFrame = () => {
  const getCoordinateForPercent = (percent: number): number[] => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const getCategoryDataPath = (
    { percentage, category }: CategoryStatisticData,
    {
      startX,
      startY,
      endX,
      endY,
      isLargeArcFlag,
    }: { startX: number; startY: number; endX: number; endY: number; isLargeArcFlag: number },
    idx: number
  ) => {
    console.log(startX, startY, endX, endY, isLargeArcFlag);
    const svg = <Path d={`M ${startX} ${startY} A 1 1 0 ${isLargeArcFlag} 1 ${endX} ${endY} L 0 0`} fill={'#5758BB'} />;

    return svg;
  };
  const getChartPaths = (data: CategoryStatisticData[]) => {
    let acc = 0;
    const paths = data.map(({ percentage, category }, idx) => {
      const [startX, startY] = getCoordinateForPercent(acc);
      acc += percentage;
      const [endX, endY] = getCoordinateForPercent(acc);
      const isLargeArcFlag: number = percentage > 0.5 ? 1 : 0;
      return getCategoryDataPath({ percentage, category }, { startX, startY, endX, endY, isLargeArcFlag }, idx);
    });
    // .join('');
    return paths;
  };

  const chartData = [
    { per: 50, color: 'red', test: 0 },
    { per: 20, color: 'orange', test: 50 },
    { per: 25, color: 'yellow', test: 70 },
    { per: 5, color: 'green', test: 95 },
  ]; // 차트 데이터

  return (
    <View style={styles.wrapper}>
      <View>
        <View style={styles.container}>
          <View style={styles.labelCell}>
            <Text>Date</Text>
          </View>
          <View style={styles.valueCell}>
            <Text>2022.12.18</Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.labelCell}>
            <Text>Title</Text>
          </View>
          <View style={styles.valueCell}>
            <Text>Daily Plan</Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            backgroundColor: 'yellow',
            width: 345,
            height: 345,
            alignItems: 'center',
          }}>
          <PlanChartSVG style={{ backgroundColor: 'red', width: 300, height: 300 }} />
        </View>
      </View>
      <PlanGrid style={{ position: 'absolute' }} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    height: 410,
    width: 345,
  },
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  labelCell: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 30,
  },
  valueCell: {
    justifyContent: 'center',
    width: 285,
    height: 30,
    paddingHorizontal: 10,
  },
  chartWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 345,
  },
});

export default MainSVGFrame;
