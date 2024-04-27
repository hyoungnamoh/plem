import { StyleSheet, View } from 'react-native';
import { categoryListState } from 'states/categoryListState';
import { useRecoilValue } from 'recoil';
import PlemText from 'components/Atoms/PlemText';
import { SCREEN_WIDTH } from 'constants/etc';
import { memo } from 'react';
import PaletteSvg from 'components/PaletteSvg/PaletteSvg';
import { Schedule } from 'types/calendar';

const ScheduleList = ({ allScheduleList }: { allScheduleList: Schedule[] }) => {
  const categoryList = useRecoilValue(categoryListState);

  return (
    <View style={{ marginTop: 2 }}>
      {allScheduleList.map((schedule) => {
        return (
          <View key={schedule.id} style={styles.scheduleRow}>
            <PaletteSvg
              size="small"
              color={
                categoryList.find((category) => category.value === schedule.category)?.color || categoryList[0].color
              }
            />
            <PlemText style={styles.scheduleName}>{schedule.name.slice(0, 5)}</PlemText>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  currentDateBackground: {
    width: 24,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateCell: {
    width: Math.floor(SCREEN_WIDTH / 7),
    alignItems: 'center',
    minHeight: 64,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 2,
  },
  scheduleSticker: {
    width: 6,
    height: 6,
  },
  scheduleName: {
    fontSize: 12,
    marginLeft: 2,
    paddingTop: 3,
  },
  svg: {
    position: 'absolute',
  },
});

export default memo(ScheduleList);
