import React from 'react';
import { View } from 'react-native';
import { Path, Text } from 'react-native-svg';

const Sector = ({
  fill,
  strokeColor,
  strokeLinejoin,
  strokeWidth,
  onTouchStart,
  onTouchEnd,
  onMouseEnter,
  onMouseLeave,
  path,
  title,
  href,
  transitionDuration,
  transitionTimingFunction,
  coord,
}) => {
  let result;
  const content = (
    <>
      <Path
        d={path}
        fill={'transparent'}
        stroke={'#000'}
        strokeWidth={1}
        strokeLinejoin={strokeLinejoin}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          transitionProperty: 'all',
          transitionTimingFunction: transitionTimingFunction,
          transitionDuration: transitionDuration,
        }}
      />
      {/* <View style={{ backgroundColor: 'blue' }}>
          <Text>하이</Text>
        </View> */}
      {/* <View
        style={{ width: 20, height: 20, backgroundColor: 'red', position: 'absolute', left: coord.x, top: coord.y }}
      /> */}
      <Text fill={'#000'} fontSize="8" x={coord.x} y={coord.y} textAnchor="middle">
        결과
      </Text>
    </>
  );

  // if (href) {
  //   result = <a href={href}>{content}</a>;
  // } else {
  //   result = content;
  // }
  // console.log(coord);
  return content;
};

export default Sector;
