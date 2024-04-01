import { ColorValue } from 'react-native';
import { FontStyle } from 'react-native-svg';

export type PieChartProps = {
  radius?: number;
  isThreeD?: boolean;
  donut?: boolean;
  innerRadius?: number;
  shadow?: boolean;
  innerCircleColor?: ColorValue;
  innerCircleBorderWidth?: number;
  innerCircleBorderColor?: ColorValue;
  shiftInnerCenterX?: number;
  shiftInnerCenterY?: number;
  shadowColor?: string;
  shadowWidth?: number;
  strokeWidth?: number;
  strokeColor?: string;
  backgroundColor?: string;
  data: Array<PieChartItem>;
  semiCircle?: boolean;

  showText?: boolean;
  textColor?: string;
  textSize?: number;
  fontStyle?: FontStyle;
  fontWeight?: string;
  font?: string;
  showTextBackground?: boolean;
  textBackgroundColor?: string;
  textBackgroundRadius?: number;
  showValuesAsLabels?: boolean;

  centerLabelComponent?: Function;
  tiltAngle?: string;
  initialAngle?: number;
  labelsPosition?: 'onBorder' | 'outward' | 'inward' | 'mid';
  showGradient?: boolean;
  gradientCenterColor?: string;
  onPress?: Function;
  focusOnPress?: boolean;
  toggleFocusOnPress?: boolean;
  selectedIndex?: number;
  setSelectedIndex?: Function;
  sectionAutoFocus?: boolean;
  onLabelPress?: Function;
  extraRadiusForFocused?: number;

  // custom
  onTextDragEnd?: ({ id, x, y }: { id: string; x: number; y: number }) => Promise<void>;
};

export type PieChartItem = {
  value: number;
  shiftX?: number;
  shiftY?: number;
  color?: string;
  gradientCenterColor?: string;
  text?: string;
  textColor?: string;
  textSize?: number;
  fontStyle?: FontStyle;
  fontWeight?: string;
  font?: string;
  textBackgroundColor?: string;
  textBackgroundRadius?: number;
  shiftTextX?: number;
  shiftTextY?: number;
  labelPosition?: 'onBorder' | 'outward' | 'inward' | 'mid';
  onPress?: Function;
  onLabelPress?: Function;
  strokeWidth?: number;
  strokeColor?: string;
  focused?: boolean;

  // custom
  x?: number;
  y?: number;
  id?: string;
  isEmpty?: boolean;
};

export type PieChartMainProps = {
  radius?: number;
  isThreeD?: boolean;
  donut?: boolean;
  innerRadius?: number;
  shadow?: boolean;
  innerCircleColor?: ColorValue;
  innerCircleBorderWidth?: number;
  innerCircleBorderColor?: ColorValue;
  shiftInnerCenterX?: number;
  shiftInnerCenterY?: number;
  shadowColor?: string;
  shadowWidth?: number;
  strokeWidth?: number;
  strokeColor?: string;
  backgroundColor?: string;
  data: PieChartMainItem[];
  semiCircle?: boolean;

  showText?: boolean;
  textColor?: string;
  textSize?: number;
  fontStyle?: FontStyle;
  fontWeight?: string;
  font?: string;
  showTextBackground?: boolean;
  textBackgroundColor?: string;
  textBackgroundRadius?: number;
  showValuesAsLabels?: boolean;

  centerLabelComponent?: Function;
  tiltAngle?: string;
  initialAngle?: number;
  labelsPosition?: 'onBorder' | 'outward' | 'inward' | 'mid';
  showGradient?: boolean;
  gradientCenterColor?: string;
  onPress?: Function;
  focusOnPress?: boolean;
  toggleFocusOnPress?: boolean;
  selectedIndex?: number;
  setSelectedIndex: Function;
  onLabelPress?: Function;
  isBiggerPie?: boolean;

  // custom
  onTextDragEnd?: ({ id, x, y }: { id: string; x: number; y: number }) => Promise<void>;
  dragAreaInfo: { minX: number; minY: number; maxX: number; maxY: number };
};
export type PieChartMainItem = {
  value: number;
  shiftX?: number;
  shiftY?: number;
  color?: string;
  gradientCenterColor?: string;
  text?: string;
  textColor?: string;
  textSize?: number;
  fontStyle?: FontStyle;
  fontWeight?: string;
  font?: string;
  textBackgroundColor?: string;
  textBackgroundRadius?: number;
  shiftTextX?: number;
  shiftTextY?: number;
  labelPosition?: 'onBorder' | 'outward' | 'inward' | 'mid';
  onPress?: Function;
  onLabelPress?: Function;
  strokeWidth?: number;
  strokeColor?: string;
  peripheral?: boolean;

  // custom
  x?: number;
  y?: number;
  id?: string;
  isEmpty?: boolean;
};
