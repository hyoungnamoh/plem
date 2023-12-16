import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import PlemText from '../../../../components/Atoms/PlemText';
import { memo, useCallback, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { categoryListState } from '../../../../states/categoryListState';
import { CalendarSchedule } from '../../../../api/schedules/getScheduleListApi';
import dayjs from 'dayjs';
import { selectedCalendarDateState } from '../../../../states/selectedCalendarDateState';
import { openScheduleModalState } from '../../../../states/openScheduleModalState';
import Sticker from './Sticker';

const Day = ({
  isToday,
  firstDateIndex,
  calendarSchedule,
  date,
  year,
  month,
}: {
  isToday: boolean;
  firstDateIndex: number;
  calendarSchedule?: CalendarSchedule;
  date: number;
  year: number;
  month: number;
}) => {
  const setSelectedDate = useSetRecoilState(selectedCalendarDateState);
  const setOpenScheduleModal = useSetRecoilState(openScheduleModalState);
  const categoryList = useRecoilValue(categoryListState);
  const [isSelected, setIsSelected] = useState(false);

  const getDateColor = useCallback(() => {
    if (isToday) {
      return '#fff';
    }
    if ((date + firstDateIndex) % 7 === 1) {
      return '#E40C0C';
    }

    return '#000';
  }, [isToday, date, firstDateIndex]);

  const onPressDate = () => {
    const targetDate = dayjs().set('year', year).set('month', month).set('date', date).startOf('date');

    if (isSelected) {
      setOpenScheduleModal(false);
      setSelectedDate(null);
      setIsSelected(false);
    } else {
      setOpenScheduleModal(true);
      setSelectedDate(targetDate);
      setIsSelected(true);
    }
  };

  return (
    <Pressable key={date} onPress={() => onPressDate()} style={styles.dateCell}>
      <View style={styles.currentDateBackground}>
        <Sticker isToday={isToday} year={year} date={date} month={month} />
        <PlemText
          style={{
            color: getDateColor(),
            fontSize: 14,
          }}>
          {date}
        </PlemText>
      </View>
      <View style={{ marginTop: 2 }}>
        {calendarSchedule
          ? calendarSchedule[year][month][date].map((reservedSchedule) => {
              return (
                <View key={reservedSchedule.id} style={styles.scheduleRow}>
                  <Image
                    source={
                      categoryList.find((category) => category.value === reservedSchedule.category)?.image ||
                      categoryList[0].image
                    }
                    style={styles.scheduleSticker}
                  />
                  <PlemText style={styles.scheduleName}>{reservedSchedule.name}</PlemText>
                </View>
              );
            })
          : null}
      </View>
    </Pressable>
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
    width: Math.floor(Dimensions.get('screen').width / 7),
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
    fontSize: 10,
    marginLeft: 2,
  },
  svg: {
    position: 'absolute',
  },
});

export default memo(Day);
