import { StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import CheckedBoxSvg from 'assets/images/checkedbox_white_24x24.svg';

const StartPlemButtonTitle = () => (
  <View style={styles.wrap}>
    <CheckedBoxSvg />
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
