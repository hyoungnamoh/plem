import { Image, Pressable, PressableProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

const BlackButton = (props: PressableProps) => {
  return (
    <Pressable {...props} style={[styles.button, props.style as StyleProp<ViewStyle>]}>
      <>
        <Image source={require('../../assets/images/black_box.png')} style={styles.blackBox} />
        {props.children}
      </>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'relative',
    height: 52,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blackBox: { width: '100%', position: 'absolute' },
});

export default BlackButton;
