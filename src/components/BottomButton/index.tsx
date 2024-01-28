import { useFocusEffect } from '@react-navigation/native';
import { useEffect } from 'react';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import { useRecoilState } from 'recoil';
import { bottomSafeAreaState } from 'states/bottomSafeAreaState';
import PlemText from 'components/Atoms/PlemText';

type BottomButtonProps = { title: string | JSX.Element };
const BottomButton = (props: PressableProps & BottomButtonProps) => {
  const { title, ...propsWithoutTitle } = props;
  const [bottomSafeArea, setBottomSafeArea] = useRecoilState(bottomSafeAreaState);

  useFocusEffect(() => {
    setBottomSafeArea(props.disabled ? '#AAAAAA' : '#000');
  });

  useEffect(() => {
    setBottomSafeArea(props.disabled ? '#AAAAAA' : '#000');
  }, [props.disabled]);

  return (
    <Pressable style={[styles.button, { backgroundColor: bottomSafeArea }]} {...propsWithoutTitle}>
      {typeof title === 'string' ? <PlemText style={styles.buttonTitle}>{props.title}</PlemText> : title}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  buttonTitle: {
    color: '#fff',
    fontSize: 20,
  },
});

export default BottomButton;
