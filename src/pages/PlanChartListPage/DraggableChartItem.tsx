import { Alert, Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import { PlanChart } from '../../../types/chart';
import PlemText from '../../components/Atoms/PlemText';
import { useCloneChart } from '../../hooks/mutaions/useCloneChart';
import { useDeleteChart } from '../../hooks/mutaions/useDeleteChart';
import HamburgerBarSvg from '../../assets/images/hamburgerbar_32x32.svg';

const DraggableChartItem = ({
  item,
  drag,
  isActive,
  onDeleteUpdate,
  onCloneUpdate,
}: {
  item: PlanChart;
  drag: () => void;
  isActive: boolean;
  onDeleteUpdate: ({ id }: { id: number }) => void;
  onCloneUpdate: ({ newItem }: { newItem: PlanChart; originId: number }) => void;
}) => {
  const { mutate: cloneChart } = useCloneChart({
    onSuccess: ({ data }) => {
      onCloneUpdate({ newItem: data, originId: item.id });
    },
    onError: (error) => {
      console.info('useCloneChart onError Error: ', error);
      Alert.alert('알 수 없는 에러가 발생햇습니다 ;ㅂ;');
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
    onError: (e) => {
      Alert.alert('알 수 없는 에러가 발생햇습니다 ;ㅂ;');
    },
  });

  const onPressClone = (id: number) => {
    cloneChart({ id });
  };

  const onPressDelete = (id: number) => {
    deleteChart({ id });
  };
  return (
    <View style={styles.wrap}>
      <View style={styles.contentContainer}>
        <Pressable onPressIn={drag}>
          <HamburgerBarSvg />
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
        <Pressable style={styles.cloneButton} hitSlop={8} onPress={() => onPressClone(item.id)}>
          <PlemText style={styles.cloneText}>복사</PlemText>
        </Pressable>
        <Pressable style={styles.removeButton} hitSlop={8} onPress={() => onPressDelete(item.id)}>
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
