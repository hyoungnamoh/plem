import PlemText from 'components/Atoms/PlemText';
import BackgroundLayer from 'components/BackgroundLayer';
import { StyleSheet } from 'react-native';
import { DownloadProgress } from 'react-native-code-push';

const CodePushUpdating = ({ progress }: { progress: DownloadProgress }) => {
  const percentage = Math.floor((progress.receivedBytes / progress.totalBytes) * 100);
  return (
    <BackgroundLayer>
      <PlemText style={{ color: '#fff' }}>앱 업데이트 중... {isNaN(percentage) ? 0 : percentage} / 100%</PlemText>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  spinner: {
    width: 100,
    height: 100,
  },
});

export default CodePushUpdating;
