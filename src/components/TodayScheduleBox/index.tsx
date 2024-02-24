import { NavigationProp, useNavigation } from '@react-navigation/native';
import ToadyScheduleBoxSvg from 'assets/images/today-schedule-box.svg';
import CalendarSvg from 'assets/images/today-schedule-calendar.svg';
import PlemText from 'components/Atoms/PlemText';
import { BOTTOM_TAB_HEIGHT } from 'components/BottomTabBar/constants';
import dayjs from 'dayjs';
import { Pressable, StyleSheet, View } from 'react-native';
import { LoggedInTabParamList } from 'types/appInner';

const TodayScheduleBox = ({ todayScheduleCount }: { todayScheduleCount: number }) => {
  const navigation = useNavigation<NavigationProp<LoggedInTabParamList>>();

  const confirmTodaySchedule = () => {
    navigation.navigate('CalendarTab', { screen: 'CalendarPage', params: { selectedDate: dayjs().unix() } });
  };

  return (
    <Pressable style={styles.wrap} onPress={confirmTodaySchedule}>
      <View style={styles.innerWrap}>
        <ToadyScheduleBoxSvg preserveAspectRatio="none" width={'100%'} />
        <View style={styles.textWrap}>
          <CalendarSvg />
          <PlemText style={{ marginLeft: 4 }}>오늘 등록된 {todayScheduleCount}개의 일정이 있어요!</PlemText>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 12,
    bottom: BOTTOM_TAB_HEIGHT + 12,
  },
  innerWrap: {
    position: 'relative',
    alignContent: 'center',
    width: '100%',
  },
  textWrap: {
    position: 'absolute',
    width: '100%',
    height: 50,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TodayScheduleBox;
