import { PickerIOS } from '@react-native-picker/picker';
import { useState } from 'react';
import { Alert, Dimensions, Image, Pressable, View } from 'react-native';
import { useRecoilState } from 'recoil';
import { timePickerState } from '../../states/timePickerState';
import Modal from 'react-native-modal';
import PlemText from '../Atoms/PlemText';
import dayjs from 'dayjs';

const TimePicker = () => {
  const [pickValue, setPickerValue] = useState(1);
  const [timePicker, setTimePicker] = useRecoilState(timePickerState);

  return (
    // <View style={{ flex: 1 }}>
    <Modal
      isVisible={timePicker.visible}
      onBackdropPress={() => setTimePicker({ visible: false })}
      style={{ margin: 0, alignItems: 'center' }}
      animationIn={'fadeIn'}>
      <Image
        source={require('../../assets/images/asdasd.png')}
        style={
          {
            // position: 'absolute',
          }
        }
      />
      <Pressable
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          position: 'absolute',
          height: 260,
        }}>
        <View style={{}}>
          <PickerIOS
            style={{ width: Dimensions.get('screen').width / 3, fontFamily: 'LeeSeoyun' }}
            selectedValue={pickValue}
            onValueChange={(value) => setPickerValue(value as number)}>
            <PickerIOS.Item value={1} label="1" />
            <PickerIOS.Item value={2} label="2" />
            <PickerIOS.Item value={3} label="3" />
            <PickerIOS.Item value={4} label="4" />
            <PickerIOS.Item value={5} label="5" />
          </PickerIOS>
        </View>
        <View style={{}}>
          <PickerIOS
            style={{
              width: Dimensions.get('screen').width / 3,
            }}>
            <PickerIOS.Item value={1} label="1" />
            <PickerIOS.Item value={2} label="2" />
            <PickerIOS.Item value={3} label="3" />
            <PickerIOS.Item value={4} label="4" />
            <PickerIOS.Item value={5} label="5" />
          </PickerIOS>
        </View>
      </Pressable>
    </Modal>
    // </View>
  );
};

export default TimePicker;
