import { Image, Pressable, StyleSheet, View } from 'react-native';
import CloseSVG from '../../../assets/images/header_close_40x40.svg';
import UnderlineButton from '../../../components/UnderlineButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PlemText from '../../../components/Atoms/PlemText';

import AddScheduleModalSvg from '../../../assets/images/add_schedule_modal.svg';
import { Dayjs } from 'dayjs';
import { NUMBER_TO_DAY_KOR } from '../../../constants/dates';
import { DaysOfWeekNum } from '../../../../types/date';
import { BOTTOM_TAB_HEIGHT } from '../../../components/BottomTabBar/constants';
import { useRecoilValue } from 'recoil';
import { categoryListState } from '../../../states/categoryListState';
import { Schedule } from '../../../../types/calendar';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { CalendarTabStackParamList } from '../../../tabs/CalendarTab';
import { CalendarSchedule } from '../../../api/schedules/getScheduleListApi';
import { SCREEN_WIDTH } from '../../../constants/etc';

type AddScheduleModalProps = {
  open: boolean;
  date: Dayjs;
  day: number | null;
  close: () => void;
  onPressAddSchedule: () => void;
  calendarSchedule?: CalendarSchedule;
};

export const AddScheduleModal = ({
  open,
  date,
  close,
  onPressAddSchedule,
  calendarSchedule,
}: AddScheduleModalProps) => {
  const { navigate } = useNavigation<NavigationProp<CalendarTabStackParamList>>();
  const categoryList = useRecoilValue(categoryListState);

  const handleScheduleClick = (schedule: Schedule) => {
    navigate('AddSchedulePage', { schedule, date: date.toISOString() });
  };

  if (!open) {
    return null;
  }

  const year = date.year();
  const month = date.month();
  const day = date.date();

  const schedules = calendarSchedule ? calendarSchedule[year][month][day] : [];
  return (
    <View style={styles.wrap}>
      <AddScheduleModalSvg style={{ position: 'absolute' }} width={345} />
      <View style={styles.modalContentWrap}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <PlemText>
              {`${date.year()}년 ${date.month() + 1}월 ${date.date()}일 (${
                NUMBER_TO_DAY_KOR[date.day() as DaysOfWeekNum]
              })`}
            </PlemText>
            <Pressable onPress={close}>
              <CloseSVG />
            </Pressable>
          </View>
          <KeyboardAwareScrollView>
            {schedules.length > 0 ? (
              schedules.map((schedule) => {
                return (
                  <Pressable key={schedule.id} style={styles.scheduleRow} onPress={() => handleScheduleClick(schedule)}>
                    <Image
                      source={
                        categoryList.find((item) => item.value === schedule.category)?.image || categoryList[0].image
                      }
                    />
                    <PlemText style={styles.scheduleText}>{schedule.name}</PlemText>
                  </Pressable>
                );
              })
            ) : (
              <View style={styles.scheduleRow}>
                <PlemText>등록된 일정이 없습니다.</PlemText>
              </View>
            )}
            <View style={styles.addScheduleButton}>
              <UnderlineButton onPress={onPressAddSchedule}>일정 추가하기</UnderlineButton>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: BOTTOM_TAB_HEIGHT + 16,
    alignItems: 'center',
  },
  modalContentWrap: {
    paddingHorizontal: 20,
    width: SCREEN_WIDTH,
    height: 210,
  },
  modalContent: {
    padding: 16,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  scheduleRow: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  addScheduleButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
  },
  scheduleText: {
    marginLeft: 8,
  },
});
