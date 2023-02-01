import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import PlemText from '../Atoms/PlemText';

type Category = 'daily' | 'birth' | 'promise' | 'banking';
type CategoryKor = '일상' | '생일' | '약속' | '금융';

const underlineImage = require('../../assets/images/underline.png');

const paletteFF6550 = require('../../assets/images/palette_ff6550.png');
const palette22DA81 = require('../../assets/images/palette_22da81.png');
const palette4569FF = require('../../assets/images/palette_4659ff.png');
const paletteFFC700 = require('../../assets/images/palette_ffc700.png');

const CATEGORY_LIST: { [key in Category]: { label: CategoryKor; value: Category; image: ImageSourcePropType } } = {
  daily: {
    label: '일상',
    value: 'daily',
    image: paletteFF6550,
  },
  birth: {
    label: '생일',
    value: 'birth',
    image: paletteFFC700,
  },
  promise: {
    label: '약속',
    value: 'promise',
    image: palette22DA81,
  },
  banking: {
    label: '금융',
    value: 'banking',
    image: palette4569FF,
  },
} as const;

const PaletteInput = ({ label, value }: { label: string; value: Category }) => {
  const category = CATEGORY_LIST[value];

  return (
    <View>
      <PlemText style={styles.label}>{label}</PlemText>
      <View style={styles.underlineButtonWrap}>
        <PlemText>{category.label}</PlemText>
        <Pressable style={styles.categoryButton} onPress={() => null}>
          {category && <Image source={category.image} style={styles.paletteImage} />}
        </Pressable>
      </View>
      <Image source={underlineImage} style={styles.underlineImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  // wrap: {
  //   hei
  // },
  label: {
    fontSize: 14,
  },
  underlineButtonWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  underlineImage: {
    width: '100%',
    marginTop: 12,
  },
  paletteImage: {
    marginLeft: 8,
  },
});

export default PaletteInput;
