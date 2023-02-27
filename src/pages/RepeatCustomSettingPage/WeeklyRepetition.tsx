import { useState } from 'react';
import { Dimensions, ImageBackground, Pressable, View } from 'react-native';
import PlemText from '../../components/Atoms/PlemText';
import SwitchInputRow from '../../components/SwitchInputRow';

const currentDayStickerImage = require('../../assets/images/current_day_sticker.png');

const WeeklyRepetition = () => {
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [hasCondition, setHasCondition] = useState(false);

  const datesOfMonth = Array.from(new Array(31).fill(0), (_, index) => index + 1);

  const onPressDate = (item: number) => {
    let newArray = [...selectedDates];

    if (selectedDates.includes(item)) {
      newArray = selectedDates.filter((day) => day !== item);
    } else {
      newArray.push(item);
    }

    setSelectedDates(newArray);
  };

  const dateComponents = datesOfMonth.map((date) => {
    const isSelectedDate = selectedDates.includes(date);
    return (
      <Pressable
        key={date}
        onPress={() => onPressDate(date)}
        style={{
          width: Math.floor(Dimensions.get('screen').width / 7),
          alignItems: 'center',
          height: 52,
          justifyContent: 'center',
        }}>
        <ImageBackground
          source={isSelectedDate ? currentDayStickerImage : null}
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
      </Pressable>
    );
  });

  const onPressCondition = () => {
    setHasCondition(!hasCondition);
  };

  return (
    <View style={{ marginTop: 32 }}>
      <SwitchInputRow label="조건지정" value={hasCondition} style={{}} onPress={onPressCondition} />
      <View
        style={{
          marginTop: 12,
          height: 48,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {dateComponents}
      </View>
    </View>
  );
};

export default WeeklyRepetition;
