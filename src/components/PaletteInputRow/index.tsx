import { useEffect, useRef, useState } from 'react';
import { GestureResponderEvent, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import PaletteListItem from './PaletteListItem';
import { Category } from 'states/categoryListState';
import PaletteSvg from 'components/PaletteSvg/PaletteSvg';
import { cloneDeep } from 'lodash';
import UnderlineSvg from 'assets/images/underline.svg';
import CalendarPaletteBoxSvg from 'assets/images/calendar_palette_box.svg';
import PlemButton, { PlemButtonProps } from 'components/Atoms/PlemButton';

export type PaletteListItemType = Category;

type PaletteInputRowProps = {
  label: string;
  open: boolean;
  list: PaletteListItemType[];
  selectedItem: PaletteListItemType;
  onSelect: (value: number) => void;
  onClose: () => void;
};

const PaletteInputRow = ({
  label,
  open,
  onPress,
  list,
  selectedItem,
  onSelect,
  onClose,
}: PaletteInputRowProps & PlemButtonProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [paletteList, setPaletteList] = useState<PaletteListItemType[]>(cloneDeep(list));
  const paletteModalRef = useRef<View>(null);
  const paletteImageRef = useRef<View>(null);

  useEffect(() => {
    setIsEditing(false);
  }, [open]);

  const onPressPalette = (e: GestureResponderEvent) => {
    onPress && onPress(e);
  };

  const handleItemSelect = (value: number) => {
    onSelect(value);
    onClose();
  };

  // TODO:
  const handleEditComplite = () => {
    setIsEditing(!isEditing);
    // setCategoryList(paletteList);
  };

  return (
    <TouchableWithoutFeedback>
      <PlemButton onPress={onPressPalette}>
        <PlemText style={styles.label}>{label}</PlemText>
        <View style={styles.underlineButtonWrap}>
          <PlemText>{selectedItem.label}</PlemText>
          <View style={styles.paletteButton} ref={paletteImageRef}>
            <PaletteSvg size="medium" color={selectedItem.color} />
          </View>
          {open && (
            <View
              ref={paletteModalRef}
              style={{
                position: 'absolute',
                right: 0,
                top: 40,
              }}>
              <CalendarPaletteBoxSvg />
              {/* <Image source={calendarPaletteBoxImage} /> */}
              <View style={{ position: 'absolute', flex: 1, padding: 16, width: 252, height: 216 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: 24,
                    alignItems: 'center',
                  }}>
                  <PlemText style={{ color: '#888888', fontSize: 16 }}>카테고리 선택</PlemText>
                  {/* <PlemButton onPress={handleEditComplite}>
                    <PlemText style={{ color: '#444444', fontSize: 16 }}>{isEditing ? '완료' : '편집'}</PlemText>
                  </PlemButton> */}
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
        <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#000'} style={styles.underline} />
      </PlemButton>
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
  underline: {
    marginTop: 12,
  },
  paletteImage: {
    marginLeft: 8,
  },
});

export default PaletteInputRow;
