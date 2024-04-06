import React, { ReactNode, useRef, useState } from 'react';
import { PanResponder, Animated, GestureResponderEvent } from 'react-native';

const Draggable = ({
  children,
  onDragEnd,
  onDragStart,
  id,
  x,
  y,
  defaultX,
  defaultY,
  dragAreaInfo,
}: {
  children: ReactNode;
  onDragEnd?: (data: { x: number; y: number; id: string }) => Promise<void>;
  onDragStart?: () => void;
  id?: string;
  x?: number;
  y?: number;
  defaultX: number;
  defaultY: number;
  dragAreaInfo: { minX: number; minY: number; maxX: number; maxY: number };
}) => {
  const [pan, setPan] = useState(new Animated.ValueXY());
  const val = useRef({ x: 0, y: 0 });
  const coordX = x ?? defaultX;
  const coordY = y ?? defaultY;
  const isOutside = (event: GestureResponderEvent) => {
    return (
      event.nativeEvent.pageY < dragAreaInfo.minY ||
      event.nativeEvent.pageY > dragAreaInfo.maxY ||
      event.nativeEvent.pageX < dragAreaInfo.minX ||
      event.nativeEvent.pageX > dragAreaInfo.maxX
    );
  };

  pan.addListener((value) => (val.current = value));
  pan.setValue({ x: 0, y: 0 });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e, gesture) => !!onDragEnd,
    onPanResponderGrant: () => {
      if (typeof onDragStart === 'function') {
        onDragStart();
      }
      pan.setOffset({
        x: val.current.x,
        y: val.current.y,
      });
      pan.setValue({ x: 0, y: 0 });
    },
    onPanResponderEnd: (event, gesture) => {
      if (isOutside(event)) {
        return;
      }
      if (typeof onDragEnd === 'function' && id) {
        onDragEnd({ x: coordX + gesture.dx, y: coordY + gesture.dy, id });
      }
    },
    onPanResponderMove: Animated.event(
      [
        null,
        {
          dx: pan.x,
          dy: pan.y,
        },
      ],
      {
        useNativeDriver: false,
        listener: (event: GestureResponderEvent) => {
          if (isOutside(event)) {
            return pan.setValue({ x: 0, y: 0 });
          }
        },
      }
    ),
  });

  const panStyle = {
    transform: pan.getTranslateTransform(),
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        panStyle,
        {
          position: 'absolute',
          zIndex: 100,
          left: coordX,
          top: coordY,
        },
      ]}>
      {children}
    </Animated.View>
  );
};

export default Draggable;
