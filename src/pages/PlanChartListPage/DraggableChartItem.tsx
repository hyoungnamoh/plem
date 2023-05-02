import { Dimensions, Image, Pressable, View } from 'react-native';
import { PlanChart } from '../../../types/chart';
import PlemText from '../../components/Atoms/PlemText';

const hamburgerbarImage = require('../../assets/images/hamburgerbar.png');

const DraggableChartItem = ({ item, drag, isActive }: { item: PlanChart; drag: () => void; isActive: boolean }) => {
  console.log(isActive);
  return (
    <View
      style={{
        paddingVertical: 8,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pressable onPressIn={drag}>
          <Image source={hamburgerbarImage} />
        </Pressable>
        <View style={{ borderWidth: 1, borderColor: '#000', borderRadius: 5, height: 64, width: 64, marginLeft: 16 }} />
        <View style={{ marginLeft: 16, justifyContent: 'center' }}>
          <PlemText style={{ width: Dimensions.get('screen').width - 260 }} numberOfLines={2}>
            {item.name}
          </PlemText>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pressable style={{ width: 40 }} hitSlop={8} onPress={() => console.log('복사')}>
          <PlemText style={{ fontSize: 16 }}>복사</PlemText>
        </Pressable>
        <Pressable style={{ width: 40, marginLeft: 16 }} hitSlop={8} onPress={() => console.log('삭제')}>
          <PlemText style={{ fontSize: 16, color: '#E40C0C' }}>삭제</PlemText>
        </Pressable>
      </View>
    </View>
  );
};

export default DraggableChartItem;
