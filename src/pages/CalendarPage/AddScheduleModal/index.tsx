import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import CloseSVG from '../../../assets/images/top_ic_close.svg';
import PaletteBlue from '../../../assets/images/palette_blue.svg';
import UnderlineButton from '../../../components/UnderlineButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PlemText from '../../../components/Atoms/PlemText';

import AddScheduleModalSVG from '../../../assets/images/add_schedule_modal.svg';
import { Dayjs } from 'dayjs';
import { NUMBER_TO_DAY_KOR } from '../../../constants/dates';
import { DaysOfWeekNum } from '../../../../types/date';
import { BOTTOM_TAB_HEIGHT } from '../../../components/BottomTabBar/constants';

type AddScheduleModalProps = {
  open: boolean;
  date: Dayjs;
  day: number | null;
  close: () => void;
  onPressAddSchedule: () => void;
};

export const AddScheduleModal = ({ open, date, close, onPressAddSchedule }: AddScheduleModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <AddScheduleModalSVG style={{ position: 'absolute' }} width={345} />
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
            <View style={styles.scheduleRow}>
              <PaletteBlue />
              <PlemText style={styles.scheduleText}>귀염둥생일</PlemText>
            </View>
            <View style={styles.scheduleRow}>
              <PaletteBlue />
              <PlemText style={styles.scheduleText}>귀염둥생일</PlemText>
            </View>
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
    width: Dimensions.get('screen').width,
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
