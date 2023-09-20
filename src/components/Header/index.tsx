import { useNavigation } from '@react-navigation/native';
import { Image, Pressable, PressableProps, StyleSheet, TextProps, View } from 'react-native';
import PlemText from '../Atoms/PlemText';

type HeaderProps = {
  onBack?: () => void;
  close?: boolean;
  title?: string;
  buttonName?: string;
  buttonProps?: PressableProps | null;
  buttonNameProps?: TextProps | null;
};

const backImage = require('../../assets/images/top_ic_back.png');
const closeImage = require('../../assets/images/top_ic_close.png');

const Header = (props: HeaderProps) => {
  const navigation = useNavigation();
  const hasButton = props.buttonName && typeof props.buttonProps?.onPress === 'function';
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Pressable onPress={props.onBack || navigation.goBack}>
          <Image source={props.close ? closeImage : backImage} />
        </Pressable>
        <PlemText style={styles.title}>{props.title}</PlemText>
      </View>
      {hasButton && (
        <Pressable hitSlop={5} {...props.buttonProps}>
          <PlemText style={{ color: props.buttonProps?.disabled ? '#AAAAAA' : '#000000' }} {...props.buttonNameProps}>
            {props.buttonName}
          </PlemText>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginLeft: 12,
  },
});

export default Header;
