import { Image, StyleSheet, View } from 'react-native';
import PlemText from '../../components/Atoms/PlemText';

const checkBoxImage = require('../../assets/images/checked_white.png');

const StartPlemButtonTitle = () => (
  <View style={styles.wrap}>
    <Image source={checkBoxImage} />
    <PlemText style={styles.text}>플렘 시작하기</PlemText>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});

export default StartPlemButtonTitle;
