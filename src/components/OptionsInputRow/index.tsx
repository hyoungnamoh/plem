import { Image, Pressable, PressableProps, StyleSheet, View } from 'react-native';
import PlemText from '../Atoms/PlemText';

const arrowRightImage = require('../../assets/images/arrow_right.png');
const underlineImage = require('../../assets/images/underline.png');

const OptionsInputRow = ({ label, value, ...pressableProps }: { label: string; value?: string } & PressableProps) => {
  return (
    <View>
      <View style={styles.underlineButtonWrap}>
        <PlemText>{label}</PlemText>
        <Pressable style={styles.underlineButton} {...pressableProps}>
          <PlemText>{value}</PlemText>
          <Image source={arrowRightImage} style={styles.arrowRightImage} />
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
  arrowRightImage: {
    marginLeft: 8,
  },
});

export default OptionsInputRow;
