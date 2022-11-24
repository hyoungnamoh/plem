import { Alert, Image, Pressable, View } from 'react-native';

type HeaderProps = {
  onBack?: () => void;
};

const Header = (props: HeaderProps) => {
  return (
    <View style={{ paddingHorizontal: 15, height: 60, justifyContent: 'center' }}>
      <Pressable onPress={props.onBack}>
        <Image source={require('../../assets/images/top_ic_back.png')} />
      </Pressable>
    </View>
  );
};

export default Header;
