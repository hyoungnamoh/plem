import { useRef, useState } from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
} from 'react-native';
import { Category, CategoryKor } from '../../../types/calendar';
import PlemText from '../Atoms/PlemText';

const underlineImage = require('../../assets/images/underline.png');

const paletteFF6550 = require('../../assets/images/palette_ff6550.png');
const palette22DA81 = require('../../assets/images/palette_22da81.png');
const palette4569FF = require('../../assets/images/palette_4659ff.png');
const paletteFFC700 = require('../../assets/images/palette_ffc700.png');

const calendarPaletteBoxImage = require('../../assets/images/calendar_palette_box.png');

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

type PaletteInputRowProps = {
  label: string;
  value: Category;
  open: boolean;
  palettePosition?: {
    x?: number;
    y?: number;
  };
};

const PaletteInputRow = ({ label, value, open, palettePosition, onPress }: PaletteInputRowProps & PressableProps) => {
  const category = CATEGORY_LIST[value];

  const [paletteBoxPosition, setPaletteBoxPosition] = useState({ x: 0, y: 0 });

  const paletteImageRef = useRef(null);

  const onPressPalette = (e: GestureResponderEvent) => {
    setPaletteBoxPosition({
      x: e.nativeEvent.pageX - 252 + (palettePosition?.x || 0),
      y: e.nativeEvent.pageY - 216 + (palettePosition?.y || 0),
    });
    onPress && onPress(e);
  };

  return (
    <View>
      <PlemText style={styles.label}>{label}</PlemText>
      <View style={styles.underlineButtonWrap}>
        <PlemText>{category.label}</PlemText>
        <Pressable style={styles.paletteButton} onPress={onPressPalette}>
          <Image source={category.image} style={styles.paletteImage} ref={paletteImageRef} />
        </Pressable>
        {open && (
          <View
            style={{
              position: 'absolute',
              left: paletteBoxPosition.x,
              top: paletteBoxPosition.y,
              backgroundColor: 'yellow',
            }}>
            <Image source={calendarPaletteBoxImage} />
            <View style={{ position: 'absolute', flex: 1, padding: 16, width: 252, height: 216 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  height: 24,
                  alignItems: 'center',
                }}>
                <PlemText style={{ color: '#888888', fontSize: 16 }}>카테고리 선택</PlemText>
                <PlemText style={{ color: '#444444', fontSize: 16 }}>편집</PlemText>
              </View>
              {Object.keys(CATEGORY_LIST).map((key) => {
                const item = CATEGORY_LIST[key as Category];
                return (
                  <View
                    style={{
                      marginTop: 8,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      height: 32,
                      alignItems: 'center',
                    }}>
                    <PlemText>{item.label}</PlemText>
                    <Image source={item.image} style={{ width: 20, height: 20 }} />
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>
      <Image source={underlineImage} style={styles.underlineImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
  },
  underlineButtonWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  paletteButton: {
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

export default PaletteInputRow;