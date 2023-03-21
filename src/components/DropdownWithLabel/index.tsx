import { StyleSheet, View } from 'react-native';
import PlemText from '../Atoms/PlemText';
import { Dropdown, DropdownProps } from '../Dropdown';

export const DropdownWithLabel = ({ label, ...dropdownProps }: { label: string } & DropdownProps) => {
  return (
    <View style={{ zIndex: 1 }}>
      <PlemText style={styles.label}>{label}</PlemText>
      <Dropdown {...dropdownProps} />
    </View>
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
    marginTop: 8,
  },
  paletteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  underlineImage: {
    width: '100%',
    marginTop: 4,
  },
});
