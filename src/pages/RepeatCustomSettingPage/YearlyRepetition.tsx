import { Dispatch, useState } from 'react';
import { Dimensions, ImageBackground, Pressable, TouchableWithoutFeedback, View } from 'react-native';
import PlemText from '../../components/Atoms/PlemText';
import { Dropdown, DropdownItem } from '../../components/Dropdown';
import SwitchInputRow from '../../components/SwitchInputRow';

const currentDateStickerImage = require('../../assets/images/current_day_sticker.png');

type YearlyRepetitionProps = {
  selectedDates: number[];
  setSelectedDates: Dispatch<React.SetStateAction<number[]>>;
};

const YearlyRepetition = ({ selectedDates, setSelectedDates }: YearlyRepetitionProps) => {
  const months = Array.from(new Array(12).fill(0), (_, index) => index + 1);

  const onPressDate = (item: number) => {
    let newArray = [...selectedDates];

    if (selectedDates.includes(item)) {
      newArray = selectedDates.filter((day) => day !== item);
    } else {
      newArray.push(item);
    }
    newArray.sort((a, b) => a - b);
    setSelectedDates(newArray);
  };

  return (
    <View style={{ marginTop: 32 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {months.map((month) => {
          return (
            <Pressable
              key={String(month)}
              onPress={() => onPressDate(month)}
              style={{
                flexDirection: 'row',
                width: Math.floor(Dimensions.get('screen').width - 30) / 6,
                alignItems: 'center',
                height: 52,
                justifyContent: 'center',
              }}>
              <ImageBackground
                source={selectedDates.includes(month) ? currentDateStickerImage : null}
                resizeMode="cover"
                style={{ width: 32, height: 28, justifyContent: 'center', alignItems: 'center' }}
                imageStyle={{ display: selectedDates.includes(month) ? 'flex' : 'none' }}>
                <PlemText
                  style={{
                    color: selectedDates.includes(month) ? '#fff' : '#000',
                  }}>
                  {`${month}월`}
                </PlemText>
              </ImageBackground>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default YearlyRepetition;
