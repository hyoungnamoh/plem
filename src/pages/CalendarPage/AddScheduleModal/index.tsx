import { StyleSheet, View } from 'react-native';
import CloseSVG from 'assets/images/header_close_40x40.svg';
import UnderlineButton from 'components/UnderlineButton';
import PlemText from 'components/Atoms/PlemText';
import AddScheduleModalSvg from 'assets/images/add_schedule_modal.svg';
import dayjs, { Dayjs } from 'dayjs';
import { NUMBER_TO_DAY_KOR } from 'constants/dates';
import { DaysOfWeekNum } from 'types/date';
import { BOTTOM_TAB_HEIGHT } from 'components/BottomTabBar/constants';
import { useRecoilValue } from 'recoil';
import { categoryListState } from 'states/categoryListState';
import { Schedule } from 'types/calendar';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { CalendarTabStackParamList } from 'tabs/CalendarTab';
import { SCREEN_WIDTH } from 'constants/etc';
import CustomScrollView from 'components/CustomScrollView/CustomScrollView';
import PaletteSvg from 'components/PaletteSvg/PaletteSvg';
import PlemButton from 'components/Atoms/PlemButton';
import { useEffect } from 'react';
import { useScheduleConfirmDate } from 'hooks/useScheduleConfirmDate';
import { useScheduleList } from 'hooks/useScheduleList';

type AddScheduleModalProps = {
  open: boolean;
  targetDate: Dayjs;
  close: () => void;
  onPressAddSchedule: () => void;
};

export const AddScheduleModal = ({ open, targetDate, close, onPressAddSchedule }: AddScheduleModalProps) => {
  const { navigate } = useNavigation<NavigationProp<CalendarTabStackParamList>>();
  const categoryList = useRecoilValue(categoryListState);
  const { updateScheduleConfirmDate } = useScheduleConfirmDate();
  const year = targetDate.year();
  const month = targetDate.month();
  const date = targetDate.date();

  useEffect(() => {
    if (open && targetDate.startOf('date').isSame(dayjs().startOf('date'))) {
      updateScheduleConfirmDate(dayjs().format('YYYY-MM-DD'));
    }
  }, [open, targetDate]);

  const handleScheduleClick = (schedule: Schedule) => {
    navigate('AddSchedulePage', { schedule, date: targetDate.startOf('date').toISOString() });
  };

  const { allScheduleList } = useScheduleList({ year, month, date });

  if (!open) {
    return null;
  }
  return (
    <View style={styles.wrap}>
      <AddScheduleModalSvg style={{ position: 'absolute' }} width={345} />
      <View style={styles.modalContentWrap}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <PlemText>
              {`${targetDate.year()}년 ${targetDate.month() + 1}월 ${targetDate.date()}일 (${
                NUMBER_TO_DAY_KOR[targetDate.day() as DaysOfWeekNum]
              })`}
            </PlemText>
            <PlemButton onPress={close}>
              <CloseSVG />
            </PlemButton>
          </View>
          <CustomScrollView>
            {allScheduleList.length > 0 ? (
              allScheduleList.map((schedule) => {
                return (
                  <PlemButton
                    key={schedule.id}
                    style={styles.scheduleRow}
                    onPress={() => handleScheduleClick(schedule)}>
                    <PaletteSvg
                      size="medium"
                      color={
                        categoryList.find((category) => category.value === schedule.category)?.color ||
                        categoryList[0].color
                      }
                    />
                    <PlemText style={styles.scheduleText}>{schedule.name}</PlemText>
                  </PlemButton>
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
          </CustomScrollView>
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
    paddingTop: 3,
  },
});
