import { useCallback } from 'react';
import { FlatList, Image, Pressable, ScrollViewProps, StyleSheet, View } from 'react-native';
import PlemText from '../Atoms/PlemText';
import ArrowDownSvg from '../../assets/images/arrow_down_32x32.svg';

const underlineImage = require('../../assets/images/underline.png');

const ITEM_HEIGHT = 40;

export type DropdownItem = { label: string; value: string | number };
export type DropdownProps = {
  open: boolean;
  list: DropdownItem[];
  scrollViewProps?: ScrollViewProps;
  onPressRow: () => void;
  onChange: (item: DropdownItem) => void;
  value: DropdownItem;
};

export const Dropdown = ({ open, list, onPressRow, onChange, value }: DropdownProps) => {
  const onChangeItem = (item: DropdownItem) => {
    onChange(item);
  };

  const renderItem = useCallback(
    ({ item }: { item: DropdownItem }) => {
      return (
        <Pressable style={{ height: ITEM_HEIGHT, justifyContent: 'center' }} onPress={() => onChangeItem(item)}>
          <PlemText>{item.label}</PlemText>
        </Pressable>
      );
    },
    [list]
  );

  const getItemLayout = useCallback(
    (data: DropdownItem[] | undefined | null, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [list]
  );

  const keyExtractor = useCallback((item: DropdownItem) => item.value.toString(), [list]);

  return (
    <View>
      <Pressable style={styles.underlineButtonWrap} onPress={onPressRow}>
        <PlemText>{value.label}</PlemText>
        <View style={styles.paletteButton}>
          <ArrowDownSvg />
        </View>
      </Pressable>
      <Image source={underlineImage} style={styles.underlineImage} />
      {open && (
        <View>
          <FlatList
            keyExtractor={keyExtractor}
            data={list}
            renderItem={renderItem}
            contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 16 }}
            getItemLayout={getItemLayout}
            removeClippedSubviews={true}
            style={{
              width: '100%',
              height: 196,
              backgroundColor: '#fff',
              borderColor: '#000',
              borderRadius: 5,
              borderWidth: 2,
              position: 'absolute',
              top: 8,
            }}
          />
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
