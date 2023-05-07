import { Dimensions, Image, StyleSheet, View } from 'react-native';
import PlemText from '../Atoms/PlemText';

const spinnerGif = require('../../assets/images/loading.gif');

const Loading = () => {
  return (
    <View style={styles.loadingWrap}>
      <Image source={spinnerGif} style={styles.spinner} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingWrap: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 100000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  spinner: {
    width: 100,
    height: 100,
  },
});

export default Loading;
