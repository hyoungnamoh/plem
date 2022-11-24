import React from 'react';
import { Text } from 'react-native';
import { Ellipse } from 'react-native-svg';

const Circle = ({
  center,
  color,
  onMouseEnter,
  onMouseLeave,
  onTouchEnd,
  onTouchStart,
  radius,
  strokeColor,
  strokeWidth,
  title,
}) => (
  <Ellipse
    cx={center}
    cy={center}
    fill={color}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onTouchEnd={onTouchEnd}
    onTouchStart={onTouchStart}
    rx={radius}
    ry={radius}
    stroke={strokeColor}
    strokeWidth={strokeWidth}>
    {/* {title && <Text>{title}</Text>} */}
  </Ellipse>
);

export default Circle;
