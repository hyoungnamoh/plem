import { Path, Svg, SvgProps } from 'react-native-svg';

const YellowLine = (props: SvgProps) => {
  return (
    <Svg {...props}>
      <Path
        d="M4 5.25C38.0891 3.07732 71.9339 4.39703 106 4.39703"
        stroke="#FFE600"
        stroke-width="8"
        stroke-linecap="round"
      />
    </Svg>
  );
};

export default YellowLine;
