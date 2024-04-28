import { StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import { PlanChart } from 'types/chart';

const ChartListItemContent = ({ chart }: { chart: PlanChart }) => {
  return (
    <View key={`content${chart.id}`} style={styles.content}>
      <View style={{ marginLeft: 76, paddingVertical: 8 }}>
        {chart.plans.map((plan) => {
          const startHour = String(plan.startHour).padStart(2, '0');
          const startMin = String(plan.startMin).padStart(2, '0');
          const endHour = String(plan.endHour).padStart(2, '0');
          const endMin = String(plan.endMin).padStart(2, '0');

          return (
            <View key={`plan${chart.id}${plan.id}`} style={styles.contentRowContainer}>
              <View style={styles.contentRow}>
                <PlemText style={styles.planInfo} numberOfLines={1}>
                  {plan.name}
                </PlemText>
                <PlemText style={styles.planInfo}>{`${startHour}:${startMin} - ${endHour}:${endMin}`}</PlemText>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  contentRowContainer: {
    flexDirection: 'row',
    marginLeft: 16,
  },
  contentRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 20,
  },
  planInfo: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
    flex: 1,
  },
});

export default ChartListItemContent;
