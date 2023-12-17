import { FlashList } from '@shopify/flash-list';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SCREEN_WIDTH } from '../../constants/etc';

const DEFAULT_PAGE_WIDTH = SCREEN_WIDTH;

const Carousel = ({
  pages,
  pageWidth = DEFAULT_PAGE_WIDTH,
  gap = 0,
  offset = 0,
}: {
  gap?: number;
  offset?: number;
  pages: any[];
  pageWidth?: number;
}) => {
  const [page, setPage] = useState(0);

  function renderItem({ item }: any) {
    return item;
  }

  const onScroll = (e: any) => {
    const newPage = Math.round(e.nativeEvent.contentOffset.x / (pageWidth + gap));
    setPage(newPage);
  };

  return (
    <View style={styles.wrap}>
      <FlashList
        automaticallyAdjustContentInsets={false}
        data={pages}
        decelerationRate="fast"
        horizontal
        keyExtractor={(item: any, index) => `page__${index}`}
        onScroll={onScroll}
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
