import { StyleSheet } from 'react-native';
import CircleStrokeSvg from '../../../../assets/images/circle-stroke-black.svg';
import CurrentDayStickerSvg from '../../../../assets/images/current-day-sticker.svg';
import { memo } from 'react';

const Sticker = ({
  isToday,
  isSelected,
}: {
  isToday: boolean;
  year: number;
  month: number;
  date: number;
  isSelected: boolean;
}) => {
  return isToday ? (
    <CurrentDayStickerSvg style={[styles.svg, { display: isToday || isSelected ? 'flex' : 'none' }]} />
  ) : (
    <CircleStrokeSvg style={[styles.svg, { display: isToday || isSelected ? 'flex' : 'none' }]} />
  );
};

const styles = StyleSheet.create({
  svg: {
    position: 'absolute',
  },
});

export default memo(Sticker);
