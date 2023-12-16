import { StyleSheet } from 'react-native';
import CircleStrokeSvg from '../../../../assets/images/circle-stroke-black.svg';
import CurrentDayStickerSvg from '../../../../assets/images/current-day-sticker.svg';
import { selectedCalendarDateState } from '../../../../states/selectedCalendarDateState';
import { useRecoilValue } from 'recoil';
import { memo } from 'react';

const Sticker = ({ isToday, year, date, month }: { isToday: boolean; year: number; month: number; date: number }) => {
  const selectedDate = useRecoilValue(selectedCalendarDateState);
  const isSelectedDate =
    selectedDate?.year() === year && selectedDate?.month() === month && selectedDate?.date() === date;

  return isToday ? (
    <CurrentDayStickerSvg style={[styles.svg, { display: isToday || isSelectedDate ? 'flex' : 'none' }]} />
  ) : (
    <CircleStrokeSvg style={[styles.svg, { display: isToday || isSelectedDate ? 'flex' : 'none' }]} />
  );
};

const styles = StyleSheet.create({
  svg: {
    position: 'absolute',
  },
});

export default memo(Sticker);
