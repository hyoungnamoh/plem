import DraggableFlatList from 'react-native-draggable-flatlist';
import DraggableChartItem from './DraggableChartItem';
import { PlanChart } from '../../../types/chart';
import { Alert, View } from 'react-native';
import { Dispatch, SetStateAction, useState } from 'react';
import { useUpdateChartsOrder } from '../../hooks/mutaions/useUpdateList';

const DraggableChartList = ({
  charts,
  setCharts,
}: {
  charts: PlanChart[];
  setCharts: Dispatch<SetStateAction<PlanChart[]>>;
}) => {
  const { mutate: updateChartsOrder } = useUpdateChartsOrder({
    onSuccess: ({ success, data }) => {
      if (!success) {
        Alert.alert(data);
      }
    },
    onError: (e) => {
      Alert.alert('알 수 없는 에러가 발생햇습니다 ;ㅂ;');
    },
  });
  const [list, setList] = useState<PlanChart[]>(charts);

  const onDragEnd = (charts: PlanChart[]) => {
    // 프론트 리스트 순위 변경
    const newList = charts.map((chart, index) => {
      const newChart = { ...chart };
      newChart.orderNum = index;

      return newChart;
    });

    setCharts(newList);
    setList(newList);

    // DB 업데이트
    const newChartOrders = charts.map((chart, index) => {
      return {
        id: chart.id,
        order: index,
      };
    });

    updateChartsOrder({ chartOrders: newChartOrders });
  };

  return (
    <DraggableFlatList
      data={list}
      renderItem={({ item, drag, isActive }) => <DraggableChartItem item={item} drag={drag} isActive={isActive} />}
      ListFooterComponent={<View style={{ marginBottom: 20 }} />}
      keyExtractor={(item) => `draggableChart${item.id}`}
      onDragEnd={({ data }) => onDragEnd(data)}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
};

export default DraggableChartList;
