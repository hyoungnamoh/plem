import { StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import { Dropdown, DropdownProps } from 'components/Dropdown';

export function DropdownWithLabel<T>({ label, ...dropdownProps }: { label: string } & DropdownProps<T>) {
  return (
    <View style={{ zIndex: 1 }}>
      <PlemText style={styles.label}>{label}</PlemText>
      <Dropdown<T> {...dropdownProps} />
    </View>
  );
}

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
