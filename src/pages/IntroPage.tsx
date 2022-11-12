import { Pressable, Text, View } from 'react-native';
import Plemon from '../assets/images/logo_plemon.svg';

const IntroPage = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#F4F1E8', paddingHorizontal: 15 }}>
      <Plemon>
        <Text>되겠니?</Text>
      </Plemon>
      <Text>플렘과 함께하는 계획적인 일상</Text>
      <Text>회원님의 소중한 계획을 잃어버리지 않으려면</Text>
      <Text>간단한 회원가입이 필요해요!</Text>
      <Pressable style={{ backgroundColor: '#000' }}>
        <Text style={{ color: '#fff' }}>시작하기</Text>
      </Pressable>
      <Pressable style={{ borderColor: '#000', borderWidth: 1 }}>
        <Text>계정이 이미 있어요</Text>
      </Pressable>
    </View>
  );
};

export default IntroPage;
