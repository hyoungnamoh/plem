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
  const [list, setList] = useState<PlanChart[]>(charts);
  const setDisableLoading = useSetRecoilState(disableLoadingState);
  const { mutate: updateChartsOrder } = useUpdateChartsOrder({
    onSuccess: ({ success, data }) => {
      setDisableLoading(false);
      if (!success) {
        Alert.alert(data);
      }
    },
    onError: (e) => {
      Alert.alert('알 수 없는 에러가 발생햇습니다 ;ㅂ;');
      console.info(e);
      setDisableLoading(false);
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
    setList(newList);

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
    const newList = [...list].filter((item) => item.id !== id);
    setList(newList);
    setCharts(newList);
    queryClient.invalidateQueries('chartList');
  };

  const onCloneUpdate = ({ newItem, originId }: { newItem: PlanChart; originId: number }) => {
    const newList = [...list];
    const foundIndex = newList.findIndex((item) => item.id === originId);
    const splicedList = newList.splice(foundIndex + 1, newList.length);
    newList.push(newItem);
    newList.concat(splicedList);
    setList(newList.concat(splicedList));
    setCharts(newList.concat(splicedList));
  };

  return (
    <DraggableFlatList
      data={list}
      renderItem={({ item, drag, isActive }) => (
        <DraggableChartItem
          item={item}
          drag={drag}
          isActive={isActive}
          onDeleteUpdate={onDeleteUpdate}
          onCloneUpdate={onCloneUpdate}
        />
      )}
      ListFooterComponent={<View style={{ marginBottom: 20 }} />}
      keyExtractor={(item) => `draggableChart${item.id}`}
      onDragEnd={({ data }) => onDragEnd(data)}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
};

export default DraggableChartList;
