import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import Header from 'components/Header';
import UnderlineTextInput from 'components/UnderlineTextInput';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabStackParamList } from 'tabs/MainTab';
import BottomButton from 'components/BottomButton';
import { MAIN_COLOR } from 'constants/colors';
import { notiOptiosList } from 'pages/PlanNotiSettingPage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useAddPlan } from './useAddPlan';
import { timePadStart } from 'helper/timePadStart';
import ArrowRightSvg from 'assets/images/arrow_right_32x32.svg';
import ArrowDownSvg from 'assets/images/arrow_down_32x32.svg';
import UnderlineSvg from 'assets/images/underline.svg';
import PlemButton from 'components/Atoms/PlemButton';

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
    openStartTimePicker,
    onPressStartConfirm,
    onPressStartCancel,
    openEndPicker,
    onPressEndConfirm,
    onPressEndCancel,
    getTimePickerValue,
  } = useAddPlan({
    route,
    navigation,
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                  <PlemButton style={styles.setTimeButton} onPress={onPressSetStart}>
                    <PlemText style={{ color: '#000000' }}>
                      {`${timePadStart(startHour)}:${timePadStart(startMin)}`}
                    </PlemText>
                    <ArrowDownSvg style={styles.arrowDownImage} />
                  </PlemButton>
                </View>
                <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#000'} style={styles.underline} />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <View style={styles.timeInputWrap}>
                  <PlemText>종료 시간</PlemText>
                  <PlemButton style={styles.setTimeButton} onPress={onPressSetEnd}>
                    <PlemText style={{ color: '#000000' }}>{`${timePadStart(endHour)}:${timePadStart(
                      endMin
                    )}`}</PlemText>
                    <ArrowDownSvg style={styles.arrowDownImage} />
                  </PlemButton>
                </View>
                <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#000'} style={styles.underline} />
              </View>
            </View>
            <View style={styles.underlineButtonWrap}>
              <PlemText>알림</PlemText>
              <PlemButton style={styles.underlineButton} onPress={onPressSetNotification}>
                <PlemText>
                  {notiOptiosList.find((notification) => notification.key === plan.notification)?.label}
                </PlemText>
                <ArrowRightSvg style={styles.arrowRightImage} />
              </PlemButton>
            </View>
            <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#000'} style={styles.underline} />
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
          isVisible={openStartTimePicker}
          mode="time"
          onConfirm={onPressStartConfirm}
          onCancel={onPressStartCancel}
          locale="en_GB"
          is24Hour
          minuteInterval={5}
          date={getTimePickerValue({ hour: startHour, min: startMin })}
        />
        <DateTimePickerModal
          isVisible={openEndPicker}
          mode="time"
          onConfirm={onPressEndConfirm}
          onCancel={onPressEndCancel}
          locale="en_GB"
          is24Hour
          minuteInterval={5}
          date={getTimePickerValue({ hour: endHour, min: endMin })}
        />
      </View>
    </TouchableWithoutFeedback>
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
  underline: {
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
