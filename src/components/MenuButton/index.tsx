import { StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import { MenuItem } from 'constants/menus';
import ArrowRightSvg from 'assets/images/arrow_right_32x32.svg';
import PlemButton from 'components/Atoms/PlemButton';

const MenuButton = ({ item, onPress }: { item: MenuItem; onPress: (menu: MenuItem) => void }) => {
  const { title, labelProps, label, arrow = true } = item;
  return (
    <PlemButton style={styles.buttonRow} onPress={() => onPress(item)}>
      <PlemText>{item.title}</PlemText>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <PlemText {...item.labelProps} style={[{ marginRight: 8 }, item.labelProps?.style]}>
          {item.label}
        </PlemText>
        {arrow ? <ArrowRightSvg /> : null}
      </View>
    </PlemButton>
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
