import BackgroundLayer from 'components/BackgroundLayer';
import { Image, StyleSheet } from 'react-native';

const spinnerGif = require('../../assets/images/loading.gif');

const Loading = () => {
  return (
    <BackgroundLayer>
      <Image source={spinnerGif} style={styles.spinner} />
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  spinner: {
    width: 100,
    height: 100,
  },
});

export default Loading;
