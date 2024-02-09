import { useCallback } from 'react';
import { FlatList, Pressable, ScrollViewProps, StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import ArrowDownSvg from 'assets/images/arrow_down_32x32.svg';
import UnderlineSvg from 'assets/images/underline.svg';

const ITEM_HEIGHT = 40;

export type DropdownItem<T = string | number> = { label: string; value: T };
export type DropdownProps = {
  open: boolean;
  list: DropdownItem[];
  scrollViewProps?: ScrollViewProps;
  onPressRow: () => void;
  onChange: (item: DropdownItem<any>) => void;
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
      <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#000'} style={styles.underline} />
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
  underline: {
    marginTop: 4,
  },
});
