import { Dispatch, useEffect, useState } from 'react';
import { ImageBackground, View } from 'react-native';
import { RepeatSpecificCondition } from 'types/calendar';
import { DaysOfWeekNum } from 'types/date';
import PlemText from 'components/Atoms/PlemText';
import { Dropdown, DropdownItem } from 'components/Dropdown';
import SwitchInputRow from 'components/SwitchInputRow';
import { SCREEN_WIDTH } from 'constants/etc';
import PlemButton from 'components/Atoms/PlemButton';

const currentDateStickerImage = require('../../assets/images/current_day_sticker.png');

export const WEEK_LIST = [
  { label: '첫 번째', value: 1 },
  { label: '두 번째', value: 2 },
  { label: '세 번째', value: 3 },
  { label: '네 번째', value: 4 },
  { label: '다섯 번째', value: 5 },
  { label: '마지막', value: 6 },
];

const DAYS_OF_MONTH = [
  { value: 0, label: '일요일' },
  { value: 1, label: '월요일' },
  { value: 2, label: '화요일' },
  { value: 3, label: '수요일' },
  { value: 4, label: '목요일' },
  { value: 5, label: '금요일' },
  { value: 6, label: '토요일' },
];

type MonthlyRepetitionProps = {
  selectedDates: number[];
  setSelectedDates: Dispatch<React.SetStateAction<number[]>>;
  setRepeatCondition: Dispatch<React.SetStateAction<RepeatSpecificCondition | null>>;
};

const MonthlyRepetition = ({ selectedDates, setSelectedDates, setRepeatCondition }: MonthlyRepetitionProps) => {
  const [hasCondition, setHasCondition] = useState(false);
  const [openWeekList, setOpenWeekList] = useState(false);
  const [openDayList, setOpenDayList] = useState(false);
  const [week, setWeek] = useState<DropdownItem>(WEEK_LIST[0]);
  const [day, setDay] = useState<DropdownItem>(DAYS_OF_MONTH[0]);

  const datesOfMonth = Array.from(new Array(31).fill(0), (_, index) => index + 1);

  useEffect(() => {
    setRepeatCondition({ week: week.value as number, day: day.value as DaysOfWeekNum });
  }, [week, day]);

  useEffect(() => {
    if (!hasCondition) {
      setWeek(WEEK_LIST[0]);
      setDay(DAYS_OF_MONTH[0]);
      setRepeatCondition(null);
    } else {
      setRepeatCondition({ week: week.value as number, day: day.value as DaysOfWeekNum });
    }
  }, [hasCondition]);

  const onPressDate = (item: number) => {
    let newArray = [...selectedDates];

    if (selectedDates.includes(item)) {
      newArray = selectedDates.filter((selectedDate) => selectedDate !== item);
    } else {
      newArray.push(item);
    }

    newArray.sort((a, b) => a - b);
    setSelectedDates(newArray);
  };

  const dateComponents = datesOfMonth.map((date) => {
    const isSelectedDate = selectedDates.includes(date);
    return (
      <PlemButton
        key={date}
        onPress={() => onPressDate(date)}
        style={{
          width: Math.floor(SCREEN_WIDTH / 7),
          alignItems: 'center',
          height: 52,
          justifyContent: 'center',
        }}>
        <ImageBackground
          source={isSelectedDate ? currentDateStickerImage : null}
          resizeMode="cover"
          style={{ width: 24, height: 22, justifyContent: 'center', alignItems: 'center' }}
          imageStyle={{ display: isSelectedDate ? 'flex' : 'none' }}>
          <PlemText
            style={{
              color: isSelectedDate ? '#fff' : '#000',
            }}>
            {date}
          </PlemText>
        </ImageBackground>
      </PlemButton>
    );
  });

  const onPressCondition = () => {
    setHasCondition(!hasCondition);
  };

  const repeatConditionSetting = () => {
    return (
      <View style={{ flexDirection: 'row', marginTop: 32 }}>
        <View style={{ flex: 1 }}>
          <Dropdown
            open={openWeekList}
            list={WEEK_LIST}
            onPressRow={onPressWeekList}
            onChange={onChangeWeekList}
            value={week}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Dropdown
            open={openDayList}
            list={DAYS_OF_MONTH}
            onPressRow={onPressDaysList}
            onChange={onChangeDay}
            value={day}
          />
        </View>
      </View>
    );
  };

  const onChangeWeekList = (item: DropdownItem) => {
    setWeek(item);
    setOpenWeekList(false);
  };

  const onPressWeekList = () => {
    setOpenWeekList(!openWeekList);
    setOpenDayList(false);
  };

  const onChangeDay = (item: DropdownItem) => {
    setDay(item);
    setOpenDayList(false);
  };

  const onPressDaysList = () => {
    setOpenDayList(!openDayList);
    setOpenWeekList(false);
  };

  return (
    <View style={{ marginTop: 32 }}>
      <SwitchInputRow label="조건지정" value={hasCondition} style={{}} onPress={onPressCondition} />
      {hasCondition ? (
        repeatConditionSetting()
      ) : (
        <View
          style={{
            marginTop: 12,
            height: 48,
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {dateComponents}
        </View>
      )}
    </View>
  );
};

export default MonthlyRepetition;
