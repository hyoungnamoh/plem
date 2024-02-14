import { useState } from 'react';
import { Alert } from 'react-native';
import CodePush, { DownloadProgress, LocalPackage, RemotePackage } from 'react-native-code-push';

export const useCodePush = () => {
  const [syncStateMessage, setStateSyncMessage] = useState('업데이트 확인중');
  const [isCodePushUpdating, setIsCodePushUpdating] = useState<boolean>(false);
  const [needAppVersionUpdate, setNeedAppVersionUpdate] = useState<boolean>(true);
  const [syncDownloadProgress, setSyncDownloadProgress] = useState<DownloadProgress>({
    totalBytes: 0,
    receivedBytes: 0,
  });

  const checkCodePush = async () => {
    try {
      CodePush.notifyAppReady();
      const update = await CodePush.checkForUpdate();
      if (!update) {
        return;
      }
      const codePushState = getCodepushState(update);
      switch (codePushState) {
        case 'UPTODATE':
          // 최신버전 일때 로직
          break;
        case 'FORCED':
          forcedCodepushUpdate(update);
          break;
        case 'OPTIONAL':
          console.log('optional update');
          optionalCodepushUpdate(update);
          break;
        default:
          break;
      }
    } catch (error) {
      Alert.alert('업데이트 확인중 에러가 발생했습니다.');
      console.info(error);
    }
  };

  const getCodepushState = (update: RemotePackage | null) => {
    if (!update) {
      return 'UPTODATE';
    }
    if (update.isMandatory) {
      return 'FORCED';
    }
    return 'OPTIONAL';
  };

  const forcedCodepushUpdate = async (update: RemotePackage) => {
    try {
      setIsCodePushUpdating(true);
      update
        .download((progress: DownloadProgress) => {
          // 패키지 다운로드 중
          // IntroScreen 에서 보여줄 progressBar state 와 stateMessage 셋팅
          setSyncDownloadProgress(progress); // { totalBytes: number, receivedBytes: number }
          console.log('pakage downloading..', progress);

          setStateSyncMessage('패키지 다운로드 중입니다.');
        })
        .then((newPackage: LocalPackage) => {
          // 다운로드 된 패키지 적용 중
          setStateSyncMessage('패키지 적용중 입니다.');
          newPackage.install(CodePush.InstallMode.ON_NEXT_RESTART).then(() => {
            // 패키지 적용 완료됐을때
            setStateSyncMessage('적용 완료! 곧 앱이 재실행 됩니다.');
            setTimeout(() => {
              setIsCodePushUpdating(false);
              CodePush.restartApp(); // 앱 재시작
            }, 1000);
          });
        })
        .catch((error: any) => {
          console.log('error', error);
          setIsCodePushUpdating(false);
        });
    } catch (error) {
      Alert.alert('업데이트 중 에러가 발생했습니다.');
    }
  };

  const optionalCodepushUpdate = async (update: RemotePackage) => {
    try {
      update.download().then((newPackage: any) => {
        newPackage.install().done(() => {
          console.log('optional updating done');
          CodePush.allowRestart();
        });
      });
    } catch (error) {
      Alert.alert('업데이트 중 에러가 발생했습니다.');
    }
  };

  return {
    checkCodePush,
    isCodePushUpdating,
    syncDownloadProgress,
    syncStateMessage,
    needAppVersionUpdate,
    setNeedAppVersionUpdate,
  };
};
