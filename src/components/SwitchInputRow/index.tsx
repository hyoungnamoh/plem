import { Image, Pressable, PressableProps, StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import SwitchOnSvg from 'assets/images/switch_on_52x28.svg';
import SwitchOffSvg from 'assets/images/switch_off_52x28.svg';

const underlineImage = require('../../assets/images/underline.png');

const SwitchInputRow = ({ label, value, ...pressableProps }: { label: string; value: boolean } & PressableProps) => {
  return (
    <View>
      <View style={styles.underlineButtonWrap}>
        <PlemText>{label}</PlemText>
        <Pressable style={styles.underlineButton} {...pressableProps}>
          {value ? <SwitchOnSvg style={styles.switchOnImage} /> : <SwitchOffSvg style={styles.switchOnImage} />}
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
