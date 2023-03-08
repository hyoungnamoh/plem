import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { Category, CategoryKor } from '../../../types/calendar';
import PlemText from '../Atoms/PlemText';

const CategoryRow = ({ item }: { item: { label: CategoryKor; value: Category; image: ImageSourcePropType } }) => {
  return (
    <View style={styles.categoryRow}>
      <PlemText>{item.label}</PlemText>
      <Image source={item.image} style={{ width: 20, height: 20 }} />
    </View>
  );
};

export default CategoryRow;

const styles = StyleSheet.create({
  categoryRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 32,
    alignItems: 'center',
  },
});
