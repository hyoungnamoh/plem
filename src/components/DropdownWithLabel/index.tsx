import { Image, Pressable, ScrollView, ScrollViewProps, StyleSheet, View } from 'react-native';
import PlemText from '../Atoms/PlemText';

const underlineImage = require('../../assets/images/underline.png');
const arrowDownImage = require('../../assets/images/arrow_down.png');

export type DropdownItem = { label: string; value: string | number };

export const DropdownWithLabel = ({
  label,
  open,
  list,
  onPressRow,
  onChange,
  value,
}: {
  label: string;
  open: boolean;
  list: DropdownItem[];
  scrollViewProps?: ScrollViewProps;
  onPressRow: () => void;
  onChange: (item: DropdownItem) => void;
  value: DropdownItem;
}) => {
  const onChangeItem = (item: DropdownItem) => {
    onChange(item);
  };

  return (
    <View>
      <PlemText style={styles.label}>{label}</PlemText>
      <Pressable style={styles.underlineButtonWrap} onPress={onPressRow}>
        <PlemText>{value.label}</PlemText>
        <View style={styles.paletteButton}>
          <Image source={arrowDownImage} />
        </View>
      </Pressable>
      <Image source={underlineImage} style={styles.underlineImage} />
      {open && (
        <View>
          <ScrollView
            contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 16 }}
            style={{
              width: '100%',
              height: 196,
              backgroundColor: '#fff',
              borderColor: '#000',
              borderRadius: 5,
              borderWidth: 2,
              position: 'absolute',
              top: 8,
            }}>
            {list.map((item) => (
              <Pressable style={{ height: 40, justifyContent: 'center' }} onPress={() => onChangeItem(item)}>
                <PlemText>{item.label}</PlemText>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
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
