import { useCallback } from 'react';
import { FlatList, ScrollViewProps, StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import ArrowDownSvg from 'assets/images/arrow_down_32x32.svg';
import UnderlineSvg from 'assets/images/underline.svg';
import PlemButton from 'components/Atoms/PlemButton';

const ITEM_HEIGHT = 40;
const SMALL_LIST_HEIGHT = 104;
const MEDIUM_LIST_HEIGHT = 144;
const LARGE_LIST_HEIGHT = 184;

const DropdownListSize = {
  small: SMALL_LIST_HEIGHT,
  medium: MEDIUM_LIST_HEIGHT,
  large: LARGE_LIST_HEIGHT,
};

export type DropdownItem<T = string | number> = { label: string; value: T };
export type DropdownProps<T = string | number> = {
  open: boolean;
  list: DropdownItem<T>[];
  scrollViewProps?: ScrollViewProps;
  onPressRow: () => void;
  onChange: (item: DropdownItem<T>) => void;
  value: DropdownItem<T>;
  size?: 'small' | 'medium' | 'large';
};

export function Dropdown<T>({ open, list, onPressRow, onChange, value, size }: DropdownProps<T>) {
  const onChangeItem = (item: DropdownItem<T>) => {
    onChange(item);
  };

  const renderItem = useCallback(
    ({ item }: { item: DropdownItem<T> }) => {
      return (
        <PlemButton style={{ height: ITEM_HEIGHT, justifyContent: 'center' }} onPress={() => onChangeItem(item)}>
          <PlemText>{item.label}</PlemText>
        </PlemButton>
      );
    },
    [list]
  );

  const getItemLayout = useCallback(
    (data: DropdownItem<T>[] | undefined | null, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [list]
  );

  const keyExtractor = useCallback((item: DropdownItem<T>) => String(item.value), [list]);

  return (
    <View>
      <PlemButton style={styles.underlineButtonWrap} onPress={onPressRow}>
        <PlemText>{value.label}</PlemText>
        <View style={styles.paletteButton}>
          <ArrowDownSvg />
        </View>
      </PlemButton>
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
              height: size ? DropdownListSize[size] : LARGE_LIST_HEIGHT,
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
  underline: {
    marginTop: 4,
  },
});
