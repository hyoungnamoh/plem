import { FlashList } from '@shopify/flash-list';
import React, { useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SCREEN_WIDTH } from '../../constants/etc';

const DEFAULT_PAGE_WIDTH = SCREEN_WIDTH;

const Carousel = ({
  pages,
  pageWidth = DEFAULT_PAGE_WIDTH,
  gap = 0,
  offset = 0,
  defaultPage = 0,
}: {
  gap?: number;
  offset?: number;
  pages: any[];
  pageWidth?: number;
  defaultPage?: number;
}) => {
  const [page, setPage] = useState(defaultPage);
  const carouselRef = useRef<FlashList<FlatList>>(null);

  const renderItem = ({ item }: any) => {
    return item;
  };

  const onScroll = (e: any) => {
    const newPage = Math.round(e.nativeEvent.contentOffset.x / (pageWidth + gap));
    setPage(newPage);
  };

  return (
    <View style={styles.wrap}>
      <FlashList
        initialScrollIndex={defaultPage}
        ref={carouselRef}
        automaticallyAdjustContentInsets={false}
        data={pages}
        onMomentumScrollEnd={onScroll}
        decelerationRate="fast"
        horizontal
        keyExtractor={(item: any, index) => `page__${index}`}
        pagingEnabled
        renderItem={renderItem}
        snapToInterval={pageWidth + gap}
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={pageWidth}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Carousel;
