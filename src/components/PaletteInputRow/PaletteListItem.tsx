import { Dispatch, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import PlemTextInput from 'components/Atoms/PlemTextInput';
import { PaletteListItemType } from 'components/PaletteInputRow';
import PaletteSvg from 'components/PaletteSvg/PaletteSvg';
import { Category } from 'states/categoryListState';

const PaletteListItem = ({
  index,
  item,
  onSelect,
  isEditing,
  paletteList,
  setPaletteList,
}: {
  index: number;
  item: PaletteListItemType;
  onSelect: (value: number) => void;
  isEditing: boolean;
  paletteList: Category[];
  setPaletteList: Dispatch<React.SetStateAction<Category[]>>;
}) => {
  // const [label, setLabel] = useState<string>(item.label);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isEditing && index === 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleLabelChange = (value: string) => {
    // setLabel(value);
    setPaletteList((prev) => {
      const newPaletteList = [...prev];
      const target = newPaletteList.findIndex((palette) => palette.value === item.value);
      if (target > -1) {
        newPaletteList[target].label = value;
      }

      return newPaletteList;
    });
  };

  return (
    <Pressable onPress={() => onSelect(item.value)} style={styles.categoryRow}>
      <PlemTextInput
        ref={inputRef}
        value={paletteList[index].label}
        editable={isEditing}
        onChangeText={handleLabelChange}
        style={{ width: '80%' }}
        maxLength={12}
      />
      <PaletteSvg size="medium" color={item.color} />
    </Pressable>
  );
};

export default PaletteListItem;

const styles = StyleSheet.create({
  categoryRow: {
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    alignItems: 'center',
  },
});
