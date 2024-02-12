import { StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import ArrowRightSvg from 'assets/images/arrow_right_32x32.svg';
import UnderlineSvg from 'assets/images/underline.svg';
import PlemButton, { PlemButtonProps } from 'components/Atoms/PlemButton';

const OptionsInputRow = ({ label, value, ...pressableProps }: { label: string; value?: string } & PlemButtonProps) => {
  return (
    <View>
      <View style={styles.underlineButtonWrap}>
        <PlemText>{label}</PlemText>
        <PlemButton style={styles.underlineButton} {...pressableProps}>
          <PlemText>{value}</PlemText>
          <ArrowRightSvg style={styles.arrowRightImage} />
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
  arrowRightImage: {
    marginLeft: 8,
  },
});

export default OptionsInputRow;
