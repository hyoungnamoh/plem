import { Image, Pressable, StyleSheet, View } from 'react-native';
import PlemText from '../../components/Atoms/PlemText';
import Header from '../../components/Header';
import UnderlineTextInput from '../../components/UnderlineTextInput';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabStackParamList } from '../../tabs/MainTab';
import BottomButton from '../../components/BottomButton';
import { MAIN_COLOR } from '../../constants/color';
import { notiOptiosList } from '../PlanNotiSettingPage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useAddPlan } from './useAddPlan';
import { timePadStart } from '../../helper/timePadStart';

const arrowRightImage = require('../../assets/images/arrow_right.png');
const underlineImage = require('../../assets/images/underline.png');
const arrowDownImage = require('../../assets/images/arrow_down.png');

export type AddPlanPageProps = NativeStackScreenProps<MainTabStackParamList, 'AddPlanPage'>;

const AddPlanPage = ({ navigation, route }: AddPlanPageProps) => {
  const {
    onPressDelete,
    isModify,
    name,
    startHour,
    startMin,
    endHour,
    endMin,
    onChangeName,
    onPressSetStart,
    onPressSetEnd,
    onPressSetNotification,
    plan,
    onPressAddPlan,
    openStartPicker,
    onPressStartConfirm,
    onPressStartCancel,
    openEndPicker,
    onPressEndConfirm,
    onPressEndCancel,
    getStartPickerValue,
    getEndPickerValue,
  } = useAddPlan({
    route,
    navigation,
  });

  return (
    <View style={styles.page}>
      <Header
        title="계획 추가"
        buttonName={'삭제'}
        buttonProps={{ onPress: onPressDelete, style: { display: isModify ? 'flex' : 'none' } }}
        buttonNameProps={{ style: { color: '#E40C0C' } }}
      />
      <View style={styles.content}>
        <View>
          <PlemText style={styles.label}>계획명</PlemText>
          <UnderlineTextInput
            value={name}
            onChangeText={onChangeName}
            style={{ marginTop: 12 }}
            maxLength={14}
            placeholder={'최대 14글자'}
          />
        </View>
        <View>
          <PlemText style={[styles.label, { marginTop: 32 }]}>시간</PlemText>
          <View style={styles.timeInputContainer}>
            <View style={{ flex: 1 }}>
              <View style={styles.timeInputWrap}>
                <PlemText>시작 시간</PlemText>
                <Pressable style={styles.setTimeButton} onPress={onPressSetStart}>
                  <PlemText style={{ color: '#000000' }}>
                    {`${timePadStart(startHour)}:${timePadStart(startMin)}`}
                  </PlemText>
                  <Image source={arrowDownImage} style={styles.arrowDownImage} />
                </Pressable>
              </View>
              <Image source={underlineImage} style={styles.underlineImage} />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <View style={styles.timeInputWrap}>
                <PlemText>종료 시간</PlemText>
                <Pressable style={styles.setTimeButton} onPress={onPressSetEnd}>
                  <PlemText style={{ color: '#000000' }}>{`${timePadStart(endHour)}:${timePadStart(endMin)}`}</PlemText>
                  <Image source={arrowDownImage} style={styles.arrowDownImage} />
                </Pressable>
              </View>
              <Image source={underlineImage} style={styles.underlineImage} />
            </View>
          </View>
          <View style={styles.underlineButtonWrap}>
            <PlemText>알림</PlemText>
            <Pressable style={styles.underlineButton} onPress={onPressSetNotification}>
              <PlemText>{notiOptiosList.find((e) => e.key === plan.notification)?.label}</PlemText>
              <Image source={arrowRightImage} style={styles.arrowRightImage} />
            </Pressable>
          </View>
          <Image source={underlineImage} style={styles.underlineImage} />
        </View>
      </View>
      <BottomButton
        title={'등록'}
        disabled={
          !name ||
          !(typeof startHour === 'number') ||
          !(typeof startMin === 'number') ||
          !(typeof endHour === 'number') ||
          !(typeof endMin === 'number')
        }
        onPress={onPressAddPlan}
      />
      <DateTimePickerModal
        isVisible={openStartPicker}
        mode="time"
        onConfirm={onPressStartConfirm}
        onCancel={onPressStartCancel}
        locale="en_GB"
        is24Hour
        minuteInterval={10}
        date={getStartPickerValue()}
      />
      <DateTimePickerModal
        isVisible={openEndPicker}
        mode="time"
        onConfirm={onPressEndConfirm}
        onCancel={onPressEndCancel}
        locale="en_GB"
        is24Hour
        minuteInterval={10}
        date={getEndPickerValue()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: MAIN_COLOR,
    flex: 1,
  },
  underlineButtonWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  underlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  underlineImage: {
    width: '100%',
    marginTop: 4,
  },
  arrowRightImage: {
    marginLeft: 8,
  },
  content: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  label: {
    fontSize: 14,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  setTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowDownImage: {
    marginLeft: 8,
  },
});

export default AddPlanPage;
