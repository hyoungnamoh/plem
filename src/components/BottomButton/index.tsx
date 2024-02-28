import { useFocusEffect } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bottomSafeAreaState } from 'states/bottomSafeAreaState';
import PlemText from 'components/Atoms/PlemText';
import PlemButton, { PlemButtonProps } from 'components/Atoms/PlemButton';
import { keyboardHeightState } from 'states/keyboardHeightState';
import { bottomNochHeightState } from 'states/bottomNochHeightState';

type BottomButtonProps = { title: string | JSX.Element };
const BottomButton = (props: PlemButtonProps & BottomButtonProps) => {
  const { title, ...propsWithoutTitle } = props;
  const [bottomSafeArea, setBottomSafeArea] = useRecoilState(bottomSafeAreaState);
  const bottomNochHeight = useRecoilValue(bottomNochHeightState);
  const keyboardHeight = useRecoilValue(keyboardHeightState);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (keyboardHeight) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [keyboardHeight]);

  useEffect(() => {
    setBottomSafeArea(props.disabled ? '#AAAAAA' : '#000');
  }, [props.disabled]);

  useFocusEffect(() => {
    setBottomSafeArea(props.disabled ? '#AAAAAA' : '#000');
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { bottom: animation.interpolate({ inputRange: [0, 1], outputRange: [0, keyboardHeight - bottomNochHeight] }) },
      ]}>
      <PlemButton style={[styles.button, { backgroundColor: bottomSafeArea }]} {...propsWithoutTitle}>
        {typeof title === 'string' ? <PlemText style={styles.buttonTitle}>{props.title}</PlemText> : title}
      </PlemButton>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  buttonTitle: {
    color: '#fff',
    fontSize: 20,
  },
});

export default BottomButton;
