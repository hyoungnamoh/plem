import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import PlemText from 'components/Atoms/PlemText';
import Draggable from 'components/Draggable/Draggable';
import { PieChartMainItem, PieChartMainProps } from './types';
import { MAIN_COLOR } from 'constants/colors';
import uuid from 'react-uuid';

export const PieChartMain = (props: PieChartMainProps) => {
  const { isThreeD } = props;
  const propData = props.data;

  const data: PieChartMainItem[] = [];
  if (propData) {
    for (let i = 0; i < propData.length; i++) {
      if (propData[i].value !== 0) {
        data.push(propData[i]);
      } else {
        data.push({ ...propData[i], value: 0.0000009 });
      }
    }
  }

  const radius = props.radius || 120;
  const semiCircle = props.semiCircle || false;
  let pi = Math.PI;
  const initialAngle = props.initialAngle || (semiCircle ? pi / -2 : 0);
  const donut = props.donut || false;
  const strokeWidth = props.strokeWidth || 0;
  const strokeColor = props.strokeColor || (strokeWidth ? 'gray' : 'transparent');
  const innerRadius = props.innerRadius || radius / 2.5;

  const showText = props.showText || false;
  const textSize = props.textSize ? Math.min(props.textSize, radius / 5) : 16;
  let tiltAngle = props.tiltAngle || '55deg';
  if (tiltAngle && !isNaN(Number(tiltAngle)) && !(tiltAngle + '').endsWith('deg')) {
    tiltAngle += 'deg';
  }
  // const tilt = props.tilt ? Math.min(props.tilt, 1) : props.isThreeD ? 0.5 : 1;
  const labelsPosition = props.labelsPosition
    ? props.labelsPosition
    : donut || props.centerLabelComponent
    ? 'outward'
    : 'mid';

  const showGradient = props.showGradient || false;
  const toggleFocusOnPress = props.toggleFocusOnPress === false ? false : true;

  let isDataShifted = false;
  let minShiftX = 0,
    maxShiftX = 0,
    minShiftY = 0,
    maxShiftY = 0,
    total = 0;

  data.forEach((item: any) => {
    total += item.value;
    if (item.shiftX || item.shiftY) {
      isDataShifted = true;
      if (minShiftX > item.shiftX) {
        minShiftX = item.shiftX;
      }
      if (minShiftY > item.shiftY) {
        minShiftY = item.shiftY;
      }
      if (maxShiftX < item.shiftX) {
        maxShiftX = item.shiftX;
      }
      if (maxShiftY < item.shiftY) {
        maxShiftY = item.shiftY;
      }
    }
  });

  const horizAdjustment = maxShiftX - minShiftX;
  const vertAdjustment = maxShiftY - minShiftY;

  if (semiCircle) {
    pi = Math.PI / 2;
  }

  let cx = radius,
    cy = radius;

  total = data && data.length ? data.map((item) => item.value).reduce((v, a) => v + a) : 0;
  let acc = 0;
  let pData = data.map((item) => {
    acc += item.value / total;
    return acc;
  });
  acc = 0;
  let mData = data.map((item) => {
    let pAcc = acc;
    acc += item.value / total;
    return pAcc + (acc - pAcc) / 2;
  });
  pData = [0, ...pData];

  return (
    <View
      style={[
        {
          backgroundColor: 'transparent',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        isThreeD && { transform: [{ rotateX: tiltAngle }] },
      ]}>
      <Svg
        viewBox={`${strokeWidth / -2 + minShiftX} ${strokeWidth / -2 + minShiftY} ${
          (radius + strokeWidth) * 2 + horizAdjustment + (horizAdjustment ? strokeWidth : 0)
        } ${(radius + strokeWidth) * 2 + +vertAdjustment + (vertAdjustment ? strokeWidth : 0)}`}
        height={radius * 2 + strokeWidth}
        width={radius * 2 + strokeWidth}>
        {data.length === 1 ? (
          <>
            <Circle
              cx={cx}
              cy={cy}
              r={radius}
              fill={showGradient ? `url(#grad${0})` : data[0].color}
              onPress={() => {
                data[0].onPress ? data[0].onPress() : props.onPress ? props.onPress(data[0], 0) : null;
              }}
            />
          </>
        ) : (
          data.map((item, index) => {
            let nextItem;
            if (index === pData.length - 1) {
              nextItem = pData[0];
            } else {
              nextItem = pData[index + 1];
            }
            let sx = cx * (1 + Math.sin(2 * pi * pData[index] + initialAngle)) + (item.shiftX || 0);
            let sy = cy * (1 - Math.cos(2 * pi * pData[index] + initialAngle)) + (item.shiftY || 0);
            let ax = cx * (1 + Math.sin(2 * pi * nextItem + initialAngle)) + (item.shiftX || 0);
            let ay = cy * (1 - Math.cos(2 * pi * nextItem + initialAngle)) + (item.shiftY || 0);

            return (
              <Path
                strokeOpacity={item.isEmpty ? 0.2 : 1}
                key={`path-${uuid()}`}
                d={`M ${cx + (item.shiftX || 0)} ${cy + (item.shiftY || 0)} L ${sx} ${sy} A ${radius} ${radius} 0 ${
                  semiCircle ? 0 : data[index].value > total / 2 ? 1 : 0
                } 1 ${ax} ${ay} L ${cx + (item.shiftX || 0)} ${cy + (item.shiftY || 0)}`}
                stroke={item.strokeColor || strokeColor}
                strokeWidth={
                  props.focusOnPress && props.selectedIndex === index
                    ? 0
                    : item.strokeWidth === 0
                    ? 0
                    : item.strokeWidth || strokeWidth
                }
                fill={
                  props.selectedIndex === index || item.peripheral
                    ? 'transparent'
                    : showGradient
                    ? `url(#grad${index})`
                    : item.color
                }
                onPress={() => {
                  if (item.onPress) {
                    item.onPress();
                  } else if (props.onPress) {
                    props.onPress(item, index);
                  }
                  if (props.focusOnPress) {
                    if (props.selectedIndex === index || props.isBiggerPie) {
                      if (toggleFocusOnPress) {
                        props.setSelectedIndex(-1);
                      }
                    } else {
                      props.setSelectedIndex(index);
                    }
                  }
                }}
              />
            );
          })
        )}
      </Svg>
      {showText &&
        data.map((item, index) => {
          let mx = cx * (1 + Math.sin(2 * pi * mData[index] + initialAngle));
          let my = cy * (1 - Math.cos(2 * pi * mData[index] + initialAngle));

          let midx = (mx + cx) / 2;
          let midy = (my + cy) / 2;

          let x = midx,
            y = midy;

          const labelPosition = item.labelPosition || labelsPosition;

          if (labelPosition === 'onBorder') {
            x = mx;
            y = my;
          } else if (labelPosition === 'outward') {
            x = (midx + mx) / 2;
            y = (midy + my) / 2;
          } else if (labelPosition === 'inward') {
            x = (midx + cx) / 2;
            y = (midy + cy) / 2;
          }

          x += item.shiftTextX || 0;
          y += item.shiftTextY || 0;

          if (data.length === 1) {
            if (donut) {
              y =
                (radius -
                  innerRadius +
                  (item.textBackgroundRadius || props.textBackgroundRadius || item.textSize || textSize)) /
                2;
            } else {
              y = cy;
            }
          }
          return (
            <Draggable
              key={`draggable-${index}`}
              id={item.id}
              onDragEnd={props.onTextDragEnd}
              onDragStart={props.onTextDragStart}
              defaultX={x}
              defaultY={y}
              x={item.x}
              y={item.y}
              dragAreaInfo={props.dragAreaInfo}>
              <View style={{ borderRadius: 4, padding: item.text ? 2 : 0, backgroundColor: MAIN_COLOR }}>
                <PlemText style={{ fontSize: 14, paddingTop: 3 }}>{item.text}</PlemText>
              </View>
            </Draggable>
          );
        })}
    </View>
  );
};
