import { Image, Pressable, StyleSheet, View } from 'react-native';
import PlemText from '../Atoms/PlemText';
import { MenuItem } from '../../constants/menus';

const arrowRightImage = require('../../assets/images/arrow_right.png');

const MenuButton = ({ item, onPress }: { item: MenuItem; onPress: (menu: MenuItem) => void }) => {
  const { title, labelProps, label, arrow = true } = item;
  return (
    <Pressable style={styles.buttonRow} onPress={() => onPress(item)}>
      <PlemText>{item.title}</PlemText>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <PlemText {...item.labelProps} style={[{ marginRight: 8 }, item.labelProps?.style]}>
          {item.label}
        </PlemText>
        {arrow ? <Image source={arrowRightImage} /> : null}
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
