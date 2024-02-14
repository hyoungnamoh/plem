import { StyleSheet, View } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'constants/etc';
import { ReactNode } from 'react';

const BackgroundLayer = ({ children }: { children: ReactNode }) => {
  return <View style={styles.loadingWrap}>{children}</View>;
};

const styles = StyleSheet.create({
  loadingWrap: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 100000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default BackgroundLayer;
