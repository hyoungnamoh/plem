import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, TextInput } from 'react-native';
import PlemTextInput from '../Atoms/PlemTextInput';
import { PaletteListItemType } from '.';

const PaletteListItem = ({
  index,
  item,
  onSelect,
  isEditing,
}: {
  index: number;
  item: PaletteListItemType;
  onSelect: (value: string) => void;
  isEditing: boolean;
}) => {
  const [value, setValue] = useState<string>(item.label);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isEditing && index === 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <Pressable onPress={() => onSelect(value)} style={styles.categoryRow}>
      <PlemTextInput
        ref={inputRef}
        value={value}
        editable={isEditing}
        onChangeText={setValue}
        style={{ width: '80%' }}
        maxLength={12}
      />
      <Image source={item.image} style={{ width: 20, height: 20 }} />
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
