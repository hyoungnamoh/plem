import { memo, useMemo } from 'react';
import { View } from 'react-native';
import uuid from 'react-uuid';
import { SCREEN_WIDTH } from '../../../../constants/etc';

const EmptyDates = ({ firstDateIndex }: { firstDateIndex: number }) => {
  const emptyArray = useMemo(() => new Array(firstDateIndex).fill(1), [firstDateIndex]);
  console.log('EmptyDates');
  return (
    <>
      {emptyArray.map(() => {
        return (
          <View
            key={uuid()}
            style={{
              width: Math.floor(SCREEN_WIDTH / 7),
              alignItems: 'center',
              height: 64,
            }}
          />
        );
      })}
    </>
  );
};

export default memo(EmptyDates);
