import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { MAIN_COLOR } from '../../constants/colors';
import { BOTTOM_TABS, BOTTOM_TAB_HEIGHT } from './constants';
import { SCREEN_WIDTH } from '../../constants/etc';

const BottomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.bottomTabBar}>
      <View>
        <Image source={require('../../assets/images/underline.png')} style={styles.bottomTabBarLine} />
      </View>
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ key: route.key, name: route.name, merge: true });
            }
          };

          const TabIconSvg = isFocused ? BOTTOM_TABS[index].active : BOTTOM_TABS[index].inactive;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={styles.tab}>
              <TabIconSvg />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomTabBar: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    backgroundColor: MAIN_COLOR,
  },
  bottomTabBarLine: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    height: BOTTOM_TAB_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomTabBar;
