import { useState } from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { Category, CategoryKor } from '../../../types/calendar';
import PlemText from '../Atoms/PlemText';
import PlemTextInput from '../Atoms/PlemTextInput';

const CategoryEditRow = ({ item }: { item: { label: CategoryKor; value: Category; image: ImageSourcePropType } }) => {
  const [value, setValue] = useState<string>(item.label);
  return (
    <View style={styles.categoryRow}>
      <PlemTextInput value={value} onChangeText={setValue} style={{ width: '80%' }} maxLength={12} />
      <Image source={item.image} style={{ width: 20, height: 20 }} />
    </View>
  );
};

export default CategoryEditRow;

const styles = StyleSheet.create({
  categoryRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 32,
    alignItems: 'center',
  },
});
