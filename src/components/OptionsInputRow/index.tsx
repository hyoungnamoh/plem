import { StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import ArrowRightSvg from 'assets/images/arrow_right_32x32.svg';
import UnderlineSvg from 'assets/images/underline.svg';
import PlemButton, { PlemButtonProps } from 'components/Atoms/PlemButton';

const OptionsInputRow = ({ label, value, ...pressableProps }: { label: string; value?: string } & PlemButtonProps) => {
  return (
    <PlemButton {...pressableProps}>
      <View style={styles.underlineButtonWrap}>
        <PlemText>{label}</PlemText>
        <View style={styles.underlineButton}>
          <PlemText>{value}</PlemText>
          <ArrowRightSvg style={styles.arrowRightImage} />
        </View>
      </View>
      <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#000'} style={styles.underline} />
    </PlemButton>
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
  arrowRightImage: {
    marginLeft: 8,
  },
});

export default OptionsInputRow;
