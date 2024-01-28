import { StyleSheet, View } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { MAIN_COLOR } from 'constants/colors';
import DotActive from 'assets/images/dot_active.svg';
import DotInactive from 'assets/images/dot_inactive.svg';
import Guide1Svg from 'assets/images/guide1.svg';
import Guide2Svg from 'assets/images/guide2.svg';
import Guide3Svg from 'assets/images/guide3.svg';
import PlemText from 'components/Atoms/PlemText';
import BottomButton from 'components/BottomButton';
import { useRef, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { LoggedOutStackParamList } from 'types/appInner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { useSetRecoilState } from 'recoil';
import { lastAccessDateState } from 'states/lastAccessDateState';
import { SCREEN_WIDTH } from 'constants/etc';

const screenWidth = Math.round(SCREEN_WIDTH);
const PAGES = [
  {
    id: 1,
    svg: <Guide1Svg style={{ marginTop: 50 }} />,
    text: '동그란 원 안에\n나의 하루 계획을 채워요.',
  },
  {
    id: 2,
    svg: <Guide2Svg style={{ marginTop: 50 }} />,
    text: '간편하게 반복을 설정하고,\n계획을 관리해요.',
  },
  {
    id: 3,
    svg: <Guide3Svg style={{ marginTop: 50 }} />,
    text: '특별한 이벤트는\n따로 캘린더에 기록해요.',
  },
];

const GuidePage = () => {
  const { navigate } = useNavigation<NavigationProp<LoggedOutStackParamList>>();
  const setLastAccessDate = useSetRecoilState(lastAccessDateState);

  const [guideIndex, setGuideIndex] = useState(0);
  const carouselRef = useRef<ICarouselInstance>(null);

  return (
    <View style={styles.page}>
      <View style={styles.dotContainer}>
        {PAGES.map(({ id }, index) => {
          return index === guideIndex ? (
            <DotActive key={id} style={styles.dot} />
          ) : (
            <DotInactive key={id} style={styles.dot} />
          );
        })}
      </View>
      <Carousel
        ref={carouselRef}
        loop={false}
        data={PAGES}
        pagingEnabled={true}
        onSnapToItem={(index) => setGuideIndex(index)}
        renderItem={({ item }) => {
          const GuideSvg = item.svg;
          return (
            <View key={item.id} style={styles.carouselItem}>
              <PlemText style={{ fontSize: 24, textAlign: 'center' }}>{item.text}</PlemText>
              {GuideSvg}
            </View>
          );
        }}
        width={screenWidth}
      />
      <BottomButton
        title={'다음'}
        onPress={async () => {
          if (guideIndex === PAGES.length - 1) {
            const accessDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
            await AsyncStorage.setItem('last_access', accessDate);
            setLastAccessDate(accessDate);
            navigate('IntroPage');
            return;
          }
          carouselRef.current?.scrollTo({ count: 1, animated: true });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    width: screenWidth,
    height: '100%',
    alignItems: 'center',
    backgroundColor: MAIN_COLOR,
  },
  dotContainer: {
    flexDirection: 'row',
    height: '20%',
    alignItems: 'center',
  },
  dot: {
    marginRight: 10,
  },
  carouselItem: {
    flex: 1,
    alignItems: 'center',
  },
});

export default GuidePage;
