import { CSSProperties } from 'react';
import PieChart from './PieChart';

const data = [
  { title: 'Data 1', value: 10, color: '#22594e' },
  { title: 'Data 2', value: 20, color: '#2f7d6d' },
  { title: 'Data 3', value: 70, color: '#3da18d' },
  // { title: 'Data 4', value: 20, color: '#69c2b0' },
  // { title: 'Data 5', value: 13, color: '#a1d9ce' },
];

const PlanChartSVG = ({ style, strokeWidth }: { style: CSSProperties; strokeWidth: number }) => (
  <PieChart style={style} strokeWidth={strokeWidth} startAngle={-90} viewBoxSize={200} angleMargin={0} data={data} />
);

export default PlanChartSVG;
