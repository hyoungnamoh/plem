import { Dispatch } from 'react';
import { Image, Pressable, View } from 'react-native';
import PlemText from '../../components/Atoms/PlemText';
import CheckSvg from '../../assets/images/check_32x32.svg';

const REPEAT_DAY_LIST = [
  { value: 0, label: '일요일마다' },
  { value: 1, label: '월요일마다' },
  { value: 2, label: '화요일마다' },
  { value: 3, label: '수요일마다' },
  { value: 4, label: '목요일마다' },
  { value: 5, label: '금요일마다' },
  { value: 6, label: '토요일마다' },
];

type WeeklyRepetitionProps = {
  selectedDates: number[];
  setSelectedDates: Dispatch<React.SetStateAction<number[]>>;
};

const WeeklyRepetition = ({ selectedDates, setSelectedDates }: WeeklyRepetitionProps) => {
  const onPressRepeatDay = (item: { label: string; value: number }) => {
    let newArray = [...selectedDates];
    if (selectedDates.includes(item.value)) {
      newArray = selectedDates.filter((day) => day !== item.value);
    } else {
      newArray.push(item.value);
    }

    newArray.sort((a, b) => a - b);
    setSelectedDates(newArray);
  };

  return (
    <View style={{ marginTop: 32 }}>
      {REPEAT_DAY_LIST.map((item) => {
        return (
          <Pressable
            style={{
              height: 44,
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
            }}
            onPress={() => onPressRepeatDay(item)}>
            <PlemText>{item.label}</PlemText>
            {selectedDates.includes(item.value) && <CheckSvg style={{ alignSelf: 'flex-start' }} />}
          </Pressable>
        );
      })}
    </View>
  );
};

export default WeeklyRepetition;
