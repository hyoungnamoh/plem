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
  onSelect: (value: number) => void;
  isEditing: boolean;
}) => {
  const [label, setLabel] = useState<string>(item.label);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isEditing && index === 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <Pressable onPress={() => onSelect(item.value)} style={styles.categoryRow}>
      <PlemTextInput
        ref={inputRef}
        value={label}
        editable={isEditing}
        onChangeText={setLabel}
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
