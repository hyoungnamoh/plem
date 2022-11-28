import { useNavigation } from '@react-navigation/native';
import { Image, Pressable, StyleSheet, View } from 'react-native';

type HeaderProps = {
  onBack?: () => void;
};

const Header = (props: HeaderProps) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <Pressable onPress={props.onBack || navigation.goBack}>
        <Image source={require('../../assets/images/top_ic_back.png')} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 15,
    height: 60,
    justifyContent: 'center',
  },
});

export default Header;
