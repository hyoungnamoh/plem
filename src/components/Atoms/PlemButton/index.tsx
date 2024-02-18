import { useThrottle } from 'hooks/useThottle';
import { GestureResponderEvent, Keyboard, Pressable, PressableProps } from 'react-native';

export type PlemButtonProps = {} & PressableProps;

const PlemButton = (props: PlemButtonProps) => {
  const { onPress } = props;
  const throttle = useThrottle();

  const handlePress = (e: GestureResponderEvent) => {
    if (onPress) {
      Keyboard.dismiss();
      onPress(e);
    }
  };
  const handlePressWithThrottle = throttle(handlePress, 500);

  return <Pressable {...props} onPress={handlePressWithThrottle} />;
};

export default PlemButton;
