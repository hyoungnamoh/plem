import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import { PlanChart } from '../../../types/chart';
import PlemText from '../../components/Atoms/PlemText';

const hamburgerbarImage = require('../../assets/images/hamburgerbar.png');

const DraggableChartItem = ({ item, drag, isActive }: { item: PlanChart; drag: () => void; isActive: boolean }) => {
  const onPressClone = () => {};
  const onPressRemove = () => {};
  return (
    <View style={styles.wrap}>
      <View style={styles.contentContainer}>
        <Pressable onPressIn={drag}>
          <Image source={hamburgerbarImage} />
        </Pressable>
        {/* 차트 이미지 */}
        <View style={{ borderWidth: 1, borderColor: '#000', borderRadius: 5, height: 64, width: 64, marginLeft: 16 }} />
        <View style={styles.chartNameWrap}>
          <PlemText style={styles.chartName} numberOfLines={2}>
            {item.name}
          </PlemText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.cloneButton} hitSlop={8} onPress={onPressClone}>
          <PlemText style={styles.cloneText}>복사</PlemText>
        </Pressable>
        <Pressable style={styles.removeButton} hitSlop={8} onPress={onPressRemove}>
          <PlemText style={styles.removeText}>삭제</PlemText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    width: Dimensions.get('screen').width - 260,
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
});

export default DraggableChartItem;
