import PlemText from 'components/Atoms/PlemText';
import { MAIN_COLOR } from 'constants/colors';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'constants/etc';
import { Image, StyleSheet, View } from 'react-native';
import { DownloadProgress } from 'react-native-code-push';
import CodePushUpdateGif from 'assets/images/plem-codepush-updating.gif';
import * as Progress from 'react-native-progress';

const CodePushUpdating = ({ progress, syncStateMessage }: { progress: DownloadProgress; syncStateMessage: string }) => {
  const percentage = progress.receivedBytes && progress.totalBytes ? progress.receivedBytes / progress.totalBytes : 0;
  return (
    <View
      style={{
        backgroundColor: MAIN_COLOR,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        position: 'absolute',
        zIndex: 10000,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image source={CodePushUpdateGif} style={{ width: 124, height: 124 }} />
      <PlemText style={{ marginTop: 30 }}>{syncStateMessage}</PlemText>
      <Progress.Bar
        progress={percentage}
        width={SCREEN_WIDTH * 0.6}
        unfilledColor={'#CCC'}
        color={'#000'}
        borderWidth={0}
        height={12}
        borderRadius={14}
        style={{ marginTop: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default CodePushUpdating;
