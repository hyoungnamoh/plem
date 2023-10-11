import { useEffect, useRef, useState } from 'react';
import {
  GestureResponderEvent,
  Image,
  Pressable,
  PressableProps,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import PlemText from '../Atoms/PlemText';
import PaletteListItem from './PaletteListItem';
import { DEFAULT_CATEGORY_LIST } from '../../states/categoryListState';

const underlineImage = require('../../assets/images/underline.png');

const calendarPaletteBoxImage = require('../../assets/images/calendar_palette_box.png');

export type PaletteListItemType = typeof DEFAULT_CATEGORY_LIST[number];

type PaletteInputRowProps = {
  label: string;
  open: boolean;
  palettePosition?: {
    x?: number;
    y?: number;
  };
  list: PaletteListItemType[];
  selectedItem: PaletteListItemType;
  onSelect: (value: number) => void;
  onClose: () => void;
};

const PaletteInputRow = ({
  label,
  open,
  palettePosition,
  onPress,
  list,
  selectedItem,
  onSelect,
  onClose,
}: PaletteInputRowProps & PressableProps) => {
  const [paletteBoxPosition, setPaletteBoxPosition] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);

  const paletteImageRef = useRef(null);
  const paletteModalRef = useRef<View>(null);

  useEffect(() => {
    setIsEditing(false);
  }, [open]);

  const onPressPalette = (e: GestureResponderEvent) => {
    setPaletteBoxPosition({
      x: e.nativeEvent.pageX - 252 + (palettePosition?.x || 0),
      y: e.nativeEvent.pageY - 216 + (palettePosition?.y || 0),
    });
    onPress && onPress(e);
  };

  const handleItemSelect = (value: number) => {
    onSelect(value);
    onClose();
  };

  return (
    <TouchableWithoutFeedback>
      <View>
        <PlemText style={styles.label}>{label}</PlemText>
        <View style={styles.underlineButtonWrap}>
          <PlemText>{selectedItem.label}</PlemText>
          <Pressable style={styles.paletteButton} onPress={onPressPalette} hitSlop={10}>
            <Image source={selectedItem.image} style={styles.paletteImage} ref={paletteImageRef} />
          </Pressable>
          {open && (
            <View
              ref={paletteModalRef}
              style={{
                position: 'absolute',
                left: paletteBoxPosition.x,
                top: paletteBoxPosition.y,
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
                  <Pressable onPress={() => setIsEditing(!isEditing)}>
                    <PlemText style={{ color: '#444444', fontSize: 16 }}>{isEditing ? '완료' : '편집'}</PlemText>
                  </Pressable>
                </View>
                {list.map((item, index) => {
                  return (
                    <PaletteListItem
                      key={`${item.label}-${item.image}-${index}`}
                      index={index}
                      item={item}
                      onSelect={handleItemSelect}
                      isEditing={isEditing}
                    />
                  );
                })}
              </View>
            </View>
          )}
        </View>
        <Image source={underlineImage} style={styles.underlineImage} />
      </View>
    </TouchableWithoutFeedback>
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
