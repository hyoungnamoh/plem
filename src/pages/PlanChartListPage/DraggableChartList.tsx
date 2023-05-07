import DraggableFlatList from 'react-native-draggable-flatlist';
import DraggableChartItem from './DraggableChartItem';
import { PlanChart } from '../../../types/chart';
import { View } from 'react-native';
import { useState } from 'react';
import { useUpdateChartsOrder } from '../../hooks/mutaions/useUpdateList';

const DraggableChartList = ({ charts }: { charts: PlanChart[] }) => {
  const { mutate: updateChartsOrder } = useUpdateChartsOrder({
    onSuccess: ({ success, data }) => console.log('success', success, data),
    onError: ({ message }) => console.log('error', message),
  });
  const [list, setList] = useState<PlanChart[]>(charts);

  const onDragEnd = (charts: PlanChart[]) => {
    // 프론트 리스트 순위 변경
    const newList = charts.map((chart, index) => {
      const newChart = { ...chart };
      newChart.orderNum = index;

      return newChart;
    });
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
      keyExtractor={(item) => `draggable-item-${item.id}`}
      onDragEnd={({ data }) => onDragEnd(data)}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
};

export default DraggableChartList;
