import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { PieChartMain } from './main';
import { PieChartProps } from './types';

export const PieChart = (props: PieChartProps) => {
  const radius = props.radius || 120;
  const extraRadiusForFocused = props.extraRadiusForFocused || radius / 10;
  const pi = props.semiCircle ? Math.PI / 2 : Math.PI;
  const [selectedIndex, setSelectedIndex] = useState(props.data.findIndex((item) => item.focused === true));
  const [dragAreaInfo, setDragAreaInfo] = useState({ minX: 0, minY: 0, maxX: 0, maxY: 0 });
  const canvasRef = useRef<View>(null);

  useEffect(() => {
    const canvasRefCurrent = canvasRef.current;
    if (!canvasRefCurrent) {
      return;
    }
    // FIXME: 계획표 처음 작성할 때 첫번째 계획 등록 후 텍스트 이동 시 이동이 안되는 버그 임시 조치, 수정 필요
    setTimeout(() => {
      if (!canvasRefCurrent) {
        return;
      }
      canvasRefCurrent.measure((_, __, width, height, pageX, pageY) => {
        setDragAreaInfo({ minX: pageX, minY: pageY, maxX: pageX + width, maxY: pageY + height });
      });
    }, 100);
  }, [canvasRef.current, props.data.length]);

  let startAngle = props.initialAngle || (props.semiCircle ? -pi : 0);
  let total = 0;
  props.data.forEach((item) => {
    total += item.value;
  });
  if (selectedIndex !== 0) {
    let start = 0;
    for (let i = 0; i < selectedIndex; i++) {
      start += props.data[i].value;
    }
    startAngle += (2 * pi * start) / total;
  }

  return (
    <View
      ref={canvasRef}
      style={{
        maxHeight: (radius + extraRadiusForFocused) * 2 + 32,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'lemonchiffon',
      }}>
      <View style={{ overflow: 'hidden', width: '100%' }}>
        <PieChartMain
          {...props}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          dragAreaInfo={dragAreaInfo}
        />
      </View>
    </View>
  );
};
