import { View } from 'react-native';
import PlanGrid from '../assets/images/plan_grid.svg';

const MainSVGFrame = () => {
  return (
    <View style={{ position: 'relative', height: 410, width: 345 }}>
      <PlanGrid style={{ position: 'absolute' }} />
    </View>
  );
};

export default MainSVGFrame;
