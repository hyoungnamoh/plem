import PaletteFF6550MediumSvg from 'assets/images/palette_ff6550_stroke_24x24.svg';
import PaletteFFC700MediumSvg from 'assets/images/palette_ffc700_stroke_24x24.svg';
import Palette22DA81MediumSvg from 'assets/images/palette_22da81_stroke_24x24.svg';
import Palette4659FFMediumSvg from 'assets/images/palette_4659ff_stroke_24x24.svg';
import PaletteFF6550SmallSvg from 'assets/images/palette_ff6550_8x8.svg';
import PaletteFFC700SmallSvg from 'assets/images/palette_ffc700_8x8.svg';
import Palette22DA81SmallSvg from 'assets/images/palette_22da81_8x8.svg';
import Palette4659FFSmallSvg from 'assets/images/palette_4659ff_8x8.svg';
import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

export interface PaletteMap {
  red: FC<SvgProps>;
  yellow: FC<SvgProps>;
  green: FC<SvgProps>;
  blue: FC<SvgProps>;
}
const SmallPaletteMap: PaletteMap = {
  red: PaletteFF6550SmallSvg,
  yellow: PaletteFFC700SmallSvg,
  green: Palette22DA81SmallSvg,
  blue: Palette4659FFSmallSvg,
} as const;

const MediumPaletteMap: PaletteMap = {
  red: PaletteFF6550MediumSvg,
  yellow: PaletteFFC700MediumSvg,
  green: Palette22DA81MediumSvg,
  blue: Palette4659FFMediumSvg,
} as const;

const PaletteSvg = ({ size, color }: { size: 'small' | 'medium' | 'large'; color: keyof PaletteMap } & SvgProps) => {
  const paletteMap = size === 'small' ? SmallPaletteMap : MediumPaletteMap;
  const Palette = paletteMap[color];
  return <Palette />;
};

export default PaletteSvg;
