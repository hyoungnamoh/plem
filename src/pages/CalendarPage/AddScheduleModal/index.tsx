import { StyleSheet, View } from 'react-native';
import CloseSVG from 'assets/images/modal_close_24x24.svg';
import UnderlineButton from 'components/UnderlineButton';
import PlemText from 'components/Atoms/PlemText';
import AddScheduleModalSvg from 'assets/images/add_schedule_modal.svg';
import dayjs, { Dayjs } from 'dayjs';
import { NUMBER_TO_DAY_KOR } from 'constants/dates';
import { DaysOfWeekNum } from 'types/date';
import { BOTTOM_TAB_HEIGHT } from 'components/BottomTabBar/constants';
import { useRecoilValue } from 'recoil';
import { categoryListState } from 'states/categoryListState';
import { Holiday, Schedule } from 'types/calendar';
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

  const handleScheduleClick = (schedule: Schedule | Holiday) => {
    if (schedule.type === 'holiday') {
      return;
    }
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
                const isHoliday = schedule.type === 'holiday';
                const isSchedule = schedule.type === 'schedule';

                return (
                  <PlemButton
                    key={schedule.id}
                    style={styles.scheduleRow}
                    onPress={() => handleScheduleClick(schedule)}>
                    {isSchedule && (
                      <View style={styles.paletteWrap}>
                        <PaletteSvg
                          size="medium"
                          color={
                            categoryList.find((category) => category.value === schedule.category)?.color ||
                            categoryList[0].color
                          }
                        />
                      </View>
                    )}
                    <View style={[styles.scheduleWrap, isHoliday && { marginLeft: 0 }]}>
                      <View style={styles.scheduleNameWrap}>
                        <PlemText style={isHoliday && { color: '#E40C0C' }}>{schedule.name}</PlemText>
                      </View>
                      {isSchedule && schedule.memo && (
                        <PlemText numberOfLines={1} style={styles.memo}>
                          {schedule.memo}
                        </PlemText>
                      )}
                    </View>
                  </PlemButton>
                );
              })
            ) : (
              <View style={styles.emptySchedule}>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: '100%',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  scheduleRow: {
    flexDirection: 'row',
  },
  addScheduleButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
  },
  scheduleWrap: {
    marginLeft: 8,
    width: '100%',
  },
  paletteWrap: {
    height: 40,
    justifyContent: 'center',
  },
  scheduleNameWrap: {
    justifyContent: 'center',
    height: 40,
  },
  emptySchedule: {
    justifyContent: 'center',
    height: 40,
  },
  memo: {
    fontSize: 16,
    width: '90%',
  },
});
