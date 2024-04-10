import { View, StyleSheet } from 'react-native';
import { AddPlanChart } from 'types/chart';
import PlemText from './../Atoms/PlemText';
import { usePieChart } from 'hooks/usePieChart';
import SurprisedPlemmonSvg from 'assets/images/surprised_plemmon_39x44.svg';
import PlemTextInput from 'components/Atoms/PlemTextInput';
import { useRecoilState } from 'recoil';
import { addPlanChartState } from 'states/addPlanChartState';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'constants/etc';
import { PieChart } from 'components/PieChart';

const screenWidth = SCREEN_WIDTH;
const screenHight = SCREEN_HEIGHT;
const chartRadius = SCREEN_WIDTH / 2.65;

const AddChartTable = ({
  onTextDragEnd,
  planCoordinates,
  onTextDragStart,
}: {
  onTextDragEnd: ({ id, x, y }: { id: string; x: number; y: number }) => Promise<void>;
  planCoordinates: { [key: string]: { x: number; y: number } };
  onTextDragStart: () => void;
}) => {
  const [chart, setChart] = useRecoilState<AddPlanChart>(addPlanChartState);
  const { pieChartData, initialAngle } = usePieChart({ chart, coordinates: planCoordinates });

  const handleNameChange = (value: string) => {
    setChart({ ...chart, name: value });
  };

  if (!chart) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <View>
        <View style={[styles.container, { borderBottomWidth: 0 }]}>
          <View style={styles.labelCell}>
            <PlemText>Title</PlemText>
          </View>
          <View style={styles.valueCell}>
            <PlemTextInput
              onChangeText={handleNameChange}
              maxLength={14}
              placeholder="계획표 이름을 등록해 주세요."
              style={{ fontSize: 16 }}>
              {chart.name}
            </PlemTextInput>
          </View>
        </View>
        <View style={styles.chartBox}>
          <PlemText style={[styles.baseTimes, { top: 8 }]}>24</PlemText>
          <PlemText style={[styles.baseTimes, { right: 8 }]}>6</PlemText>
          <PlemText style={[styles.baseTimes, { bottom: 8 }]}>12</PlemText>
          <PlemText style={[styles.baseTimes, { left: 8 }]}>18</PlemText>
          {chart.plans.length > 0 ? (
            <PieChart
              data={pieChartData}
              initialAngle={initialAngle}
              showText
              textColor={'#000'}
              labelsPosition={'outward'}
              textSize={14}
              font={'AaGongCatPen'}
              strokeColor={'black'}
              strokeWidth={2}
              radius={chartRadius}
              onTextDragEnd={onTextDragEnd}
              onTextDragStart={onTextDragStart}
            />
          ) : (
            <View style={{ padding: 32 }}>
              <View
                style={{
                  width: chartRadius * 2,
                  height: chartRadius * 2,
                  borderRadius: chartRadius,
                  borderWidth: 2,
                  borderColor: '#000',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <SurprisedPlemmonSvg />
                <PlemText style={{ marginVertical: 20, fontSize: 14 }}>계획을 추가해 주세요.</PlemText>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
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
});

export default AddChartTable;
