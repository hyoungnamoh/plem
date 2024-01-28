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
import PlemText from 'components/Atoms/PlemText';
import PaletteListItem from './PaletteListItem';
import { Category, categoryListState } from 'states/categoryListState';
import PaletteSvg from 'components/PaletteSvg/PaletteSvg';
import { useSetRecoilState } from 'recoil';
import { cloneDeep } from 'lodash';

const underlineImage = require('../../assets/images/underline.png');
const calendarPaletteBoxImage = require('../../assets/images/calendar_palette_box.png');

export type PaletteListItemType = Category;

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
  const setCategoryList = useSetRecoilState(categoryListState);
  const [paletteBoxPosition, setPaletteBoxPosition] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [paletteList, setPaletteList] = useState<PaletteListItemType[]>(cloneDeep(list));
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

  const handleEditComplite = () => {
    setIsEditing(!isEditing);
    // setCategoryList(paletteList);
  };

  return (
    <TouchableWithoutFeedback>
      <View>
        <PlemText style={styles.label}>{label}</PlemText>
        <View style={styles.underlineButtonWrap}>
          <PlemText>{selectedItem.label}</PlemText>
          <Pressable style={styles.paletteButton} onPress={onPressPalette} hitSlop={10}>
            <PaletteSvg size="medium" color={selectedItem.color} />
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
                  {/* <Pressable onPress={handleEditComplite}>
                    <PlemText style={{ color: '#444444', fontSize: 16 }}>{isEditing ? '완료' : '편집'}</PlemText>
                  </Pressable> */}
                </View>
                {paletteList.map((item, index) => {
                  return (
                    <PaletteListItem
                      key={`${item.label}-${item.color}-${index}`}
                      index={index}
                      item={item}
                      onSelect={handleItemSelect}
                      isEditing={isEditing}
                      paletteList={paletteList}
                      setPaletteList={setPaletteList}
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
