import { StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import SwitchOnSvg from 'assets/images/switch_on_52x28.svg';
import SwitchOffSvg from 'assets/images/switch_off_52x28.svg';
import UnderlineSvg from 'assets/images/underline.svg';
import PlemButton, { PlemButtonProps } from 'components/Atoms/PlemButton';

const SwitchInputRow = ({ label, value, ...pressableProps }: { label: string; value: boolean } & PlemButtonProps) => {
  return (
    <View>
      <View style={styles.underlineButtonWrap}>
        <PlemText>{label}</PlemText>
        <PlemButton style={styles.underlineButton} {...pressableProps}>
          {value ? <SwitchOnSvg style={styles.switchOnImage} /> : <SwitchOffSvg style={styles.switchOnImage} />}
        </PlemButton>
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
