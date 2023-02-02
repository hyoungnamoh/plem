import { Image, Pressable, StyleSheet, View } from 'react-native';
import PlemText from '../Atoms/PlemText';

const switchOffImage = require('../../assets/images/switch_off.png');
const switchOnImage = require('../../assets/images/switch_on.png');
const underlineImage = require('../../assets/images/underline.png');

const SwitchInputRow = ({ label, value }: { label: string; value: boolean }) => {
  return (
    <View>
      <View style={styles.underlineButtonWrap}>
        <PlemText>{label}</PlemText>
        <Pressable style={styles.underlineButton} onPress={() => null}>
          <Image source={value ? switchOnImage : switchOffImage} style={styles.switchOnImage} />
        </Pressable>
      </View>
      <Image source={underlineImage} style={styles.underlineImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  underlineButtonWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  underlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  underlineImage: {
    width: '100%',
    marginTop: 4,
  },
  switchOnImage: {},
});

export default SwitchInputRow;
