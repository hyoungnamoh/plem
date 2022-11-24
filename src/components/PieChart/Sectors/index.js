import React from 'react';
import { G } from 'react-native-svg';

import Sector from '../Sector';

const Sectors = ({
  center,
  data,
  onSectorHover,
  expandSize,
  strokeWidth,
  strokeColor,
  startAngle,
  angleMargin,
  ...props
}) => {
  const total = data.reduce((prev, current) => current.value + prev, 0);
  let angleStart = startAngle;
  let angleEnd = startAngle;
  return total > 0 ? (
    <G>
      {data.map((d, i) => {
        const isLarge = d.value / total > 0.5;
        const angle = (360 * d.value) / total;
        const radius = center - strokeWidth / 2;
        angleStart = angleEnd;
        angleMargin = angleMargin > angle ? angle : angleMargin;
        angleEnd = angleStart + angle - angleMargin;
        // console.log(angleStart, angleEnd);
        const x1 = center + radius * Math.cos((Math.PI * angleStart) / 180);
        const y1 = center + radius * Math.sin((Math.PI * angleStart) / 180);
        const x2 = center + radius * Math.cos((Math.PI * angleEnd) / 180);
        const y2 = center + radius * Math.sin((Math.PI * angleEnd) / 180);
        // console.log(x1, y1, x2, y2);
        const path = `
          M${center},${center}
          L${x1},${y1}
          A${radius},${radius}
          0 ${isLarge ? 1 : 0},1
          ${x2},${y2}
          z
        `;

        angleEnd += angleMargin;

        return (
          <Sector
            key={'sector' + i}
            fill={d.color}
            path={path}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            total={total}
            // onMouseEnter={(e) => onSectorHover(d, i, e)}
            // onMouseLeave={(e) => onSectorHover(null, null, e)}
            // onTouchEnd={(e) => onSectorHover(null, null, e)}
            // onTouchStart={(e) => onSectorHover(d, i, e)}
            {...props}
            {...d}
            dd={{ x1, y1 }}
          />
        );
      })}
    </G>
  ) : null;
};

export default Sectors;
