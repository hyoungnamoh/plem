import DraggableFlatList from 'react-native-draggable-flatlist';
import DraggableChartItem from './DraggableChartItem';
import { PlanChart } from 'types/chart';
import { Alert, View } from 'react-native';
import { Dispatch, SetStateAction } from 'react';
import { useUpdateChartsOrder } from 'hooks/mutations/useUpdateList';
import { useSetRecoilState } from 'recoil';
import { disableLoadingState } from 'states/disableLoadingState';
import { useQueryClient } from 'react-query';
import { CHART_LIST_COUNT_QUERY_KEY } from 'hooks/queries/useGetChartListCount';
import { TODAY_PLAN_CHART_QUERY_KEY } from 'hooks/queries/useGetTodayPlanChart';
import { CHART_LIST_QUERY_KEY } from 'hooks/queries/useGetChartList';
import { useDoItNowUpdate } from 'hooks/useDoItNowUpdate';

const DraggableChartList = ({
  charts,
  setCharts,
  setOpenMaximumAlert,
  isChartListMaximum,
  handleEditComplete,
}: {
  charts: PlanChart[];
  setCharts: Dispatch<SetStateAction<PlanChart[]>>;
  setOpenMaximumAlert: Dispatch<SetStateAction<boolean>>;
  isChartListMaximum: boolean;
  handleEditComplete: () => void;
}) => {
  const queryClient = useQueryClient();
  const setDisableLoading = useSetRecoilState(disableLoadingState);
  const { update: updateDoItNow } = useDoItNowUpdate();
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
    queryClient.invalidateQueries(CHART_LIST_COUNT_QUERY_KEY);
    queryClient.invalidateQueries(TODAY_PLAN_CHART_QUERY_KEY);
    queryClient.invalidateQueries(CHART_LIST_QUERY_KEY);
    updateDoItNow();
    const newList = [...charts].filter((item) => item.id !== id);
    if (newList.length === 0) {
      handleEditComplete();
    }
    setCharts(newList);
  };

  const onCloneUpdate = ({ newItem, originId }: { newItem: PlanChart; originId: number }) => {
    queryClient.invalidateQueries(CHART_LIST_COUNT_QUERY_KEY);
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
        <DraggableChartItem
          item={item}
          drag={drag}
          onDeleteUpdate={onDeleteUpdate}
          onCloneUpdate={onCloneUpdate}
          isChartListMaximum={isChartListMaximum}
          setOpenMaximumAlert={setOpenMaximumAlert}
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
