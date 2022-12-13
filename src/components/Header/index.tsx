import { useNavigation } from '@react-navigation/native';
import { Image, Pressable, StyleSheet, View } from 'react-native';

type HeaderProps = {
  onBack?: () => void;
  close?: boolean;
};

const backImage = require('../../assets/images/top_ic_back.png');
const closeImage = require('../../assets/images/top_ic_close.png');

const Header = (props: HeaderProps) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <Pressable onPress={props.onBack || navigation.goBack}>
        <Image source={props.close ? closeImage : backImage} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    height: 60,
    justifyContent: 'center',
  },
});

export default Header;
