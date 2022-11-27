import { Pressable, PressableProps, StyleSheet } from 'react-native';
import PlemText from '../Atoms/PlemText';

type BottomButtonProps = { title: string };
const BottomButton = ({ onPress, title }: PressableProps & BottomButtonProps) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <PlemText style={styles.buttonTitle}>{title}</PlemText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  buttonTitle: { color: '#fff', fontSize: 18 },
});

export default BottomButton;
