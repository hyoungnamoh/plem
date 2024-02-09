import { Pressable, PressableProps, StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import SwitchOnSvg from 'assets/images/switch_on_52x28.svg';
import SwitchOffSvg from 'assets/images/switch_off_52x28.svg';
import UnderlineSvg from 'assets/images/underline.svg';

const SwitchInputRow = ({ label, value, ...pressableProps }: { label: string; value: boolean } & PressableProps) => {
  return (
    <View>
      <View style={styles.underlineButtonWrap}>
        <PlemText>{label}</PlemText>
        <Pressable style={styles.underlineButton} {...pressableProps}>
          {value ? <SwitchOnSvg style={styles.switchOnImage} /> : <SwitchOffSvg style={styles.switchOnImage} />}
        </Pressable>
      </View>
      <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#000'} style={styles.underline} />
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
  underline: {
    marginTop: 4,
  },
  switchOnImage: {},
});

export default SwitchInputRow;
