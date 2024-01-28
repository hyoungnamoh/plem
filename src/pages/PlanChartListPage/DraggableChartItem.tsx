import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { PlanChart } from 'types/chart';
import PlemText from 'components/Atoms/PlemText';
import { useCloneChart } from 'hooks/mutations/useCloneChart';
import { useDeleteChart } from 'hooks/mutations/useDeleteChart';
import HamburgerBarSvg from 'assets/images/hamburgerbar_32x32.svg';
import { PieChart } from 'react-native-gifted-charts';
import { usePieChart } from 'hooks/usePieChart';
import { SCREEN_WIDTH } from 'constants/etc';

const DraggableChartItem = ({
  item,
  drag,
  onDeleteUpdate,
  onCloneUpdate,
}: {
  item: PlanChart;
  drag: () => void;
  onDeleteUpdate: ({ id }: { id: number }) => void;
  onCloneUpdate: ({ newItem }: { newItem: PlanChart; originId: number }) => void;
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
    cloneChart({ id });
  };

  const handleDeletePress = (id: number) => {
    deleteChart({ id });
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.contentContainer}>
        <Pressable onPressIn={drag} style={{ marginRight: 16 }}>
          <HamburgerBarSvg />
        </Pressable>
        <PieChart
          data={pieChartData}
          initialAngle={initialAngle}
          showText
          textColor={'#000'}
          labelsPosition={'outward'}
          textSize={14}
          font={'LeeSeoyun'}
          strokeColor={'black'}
          strokeWidth={2}
          radius={32}
        />
        <View style={styles.chartNameWrap}>
          <PlemText style={styles.chartName} numberOfLines={2}>
            {item.name}
          </PlemText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.cloneButton} hitSlop={8} onPress={() => handleClonePress(item.id)}>
          <PlemText style={styles.cloneText}>복사</PlemText>
        </Pressable>
        <Pressable style={styles.removeButton} hitSlop={8} onPress={() => handleDeletePress(item.id)}>
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
});

export default DraggableChartItem;
