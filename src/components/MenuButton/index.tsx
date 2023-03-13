import { Image, Pressable, StyleSheet, View } from 'react-native';
import PlemText from '../Atoms/PlemText';
import { MenuItem } from '../../constants/menu';

const arrowRightImage = require('../../assets/images/arrow_right.png');

const MenuButton = ({ item, onPress }: { item: MenuItem; onPress: (menu: MenuItem) => void }) => {
  return (
    <Pressable style={styles.buttonRow} onPress={() => onPress(item)}>
      <PlemText>{item.title}</PlemText>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <PlemText style={{ marginRight: 8 }}>{item.label}</PlemText>
        <Image source={arrowRightImage} />
      </View>
    </Pressable>
  );
};

export default MenuButton;

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    marginTop: 16,
  },
});
