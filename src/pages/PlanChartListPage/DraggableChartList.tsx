import DraggableFlatList from 'react-native-draggable-flatlist';
import DraggableChartItem from './DraggableChartItem';
import { PlanChart } from '../../../types/chart';
import { Alert, View } from 'react-native';
import { Dispatch, SetStateAction, useState } from 'react';
import { useUpdateChartsOrder } from '../../hooks/mutaions/useUpdateList';
import { useSetRecoilState } from 'recoil';
import { disableLoadingState } from '../../states/disableLoadingState';
import { useQueryClient } from 'react-query';

const DraggableChartList = ({
  charts,
  setCharts,
}: {
  charts: PlanChart[];
  setCharts: Dispatch<SetStateAction<PlanChart[]>>;
}) => {
  const queryClient = useQueryClient();
  const setDisableLoading = useSetRecoilState(disableLoadingState);
  const { mutate: updateChartsOrder } = useUpdateChartsOrder({
    onSuccess: ({ success, data }) => {
      setDisableLoading(false);
      if (!success) {
        Alert.alert(data);
      }
    },
    onMutate: () => {
      setDisableLoading(true);
    },
  });

  const onDragEnd = (updatedCharts: PlanChart[]) => {
    // 프론트 리스트 순위 변경
    const newList = updatedCharts.map((chart, index) => {
      const newChart = { ...chart };
      newChart.orderNum = index;

      return newChart;
    });

    setCharts(newList);

    // DB 업데이트
    const newChartOrders = updatedCharts.map((chart, index) => {
      return {
        id: chart.id,
        order: index,
      };
    });

    updateChartsOrder({ chartOrders: newChartOrders });
  };

  const onDeleteUpdate = ({ id }: { id: number }) => {
    const newList = [...charts].filter((item) => item.id !== id);
    setCharts(newList);
    queryClient.invalidateQueries('chartList');
  };

  const onCloneUpdate = ({ newItem, originId }: { newItem: PlanChart; originId: number }) => {
    const newCharts = [...charts];
    const foundIndex = newCharts.findIndex((item) => item.id === originId);
    const splicedList = newCharts.splice(foundIndex + 1, newCharts.length);
    newCharts.push(newItem);
    newCharts.concat(splicedList);
    setCharts(newCharts.concat(splicedList));
  };

  return (
    <DraggableFlatList
      data={charts}
      renderItem={({ item, drag }) => (
        <DraggableChartItem item={item} drag={drag} onDeleteUpdate={onDeleteUpdate} onCloneUpdate={onCloneUpdate} />
      )}
      ListFooterComponent={<View style={{ marginBottom: 20 }} />}
      keyExtractor={(item) => `draggableChart${item.id}`}
      onDragEnd={({ data }) => onDragEnd(data)}
      contentContainerStyle={{ paddingBottom: 100, height: '100%' }}
    />
  );
};

export default DraggableChartList;
