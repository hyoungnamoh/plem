import { StyleSheet, View } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'constants/etc';
import { ReactNode } from 'react';

const BackgroundLayer = ({ children, zIndex }: { children: ReactNode; zIndex: number }) => {
  return <View style={{ ...styles.loadingWrap, zIndex }}>{children}</View>;
};

const styles = StyleSheet.create({
  loadingWrap: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default BackgroundLayer;
