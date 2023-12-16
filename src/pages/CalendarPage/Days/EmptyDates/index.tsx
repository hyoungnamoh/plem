import { memo, useMemo } from 'react';
import { Dimensions, View } from 'react-native';
import uuid from 'react-uuid';

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
              width: Math.floor(Dimensions.get('screen').width / 7),
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
