import React from 'react';
// import { Text, View } from 'react-native';
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
  dd,
}) => {
  console.log(dd.x1, dd.y1);
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
      <Text fill={'#000'} fontSize="8" x={55} y={108} textAnchor="middle">
        꿀같은 낮잠시간
      </Text>
    </>
  );

  if (href) {
    result = <a href={href}>{content}</a>;
  } else {
    result = content;
  }

  return result;
};

export default Sector;
