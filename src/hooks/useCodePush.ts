import { useState } from 'react';
import { Alert } from 'react-native';
import CodePush, { DownloadProgress, LocalPackage, RemotePackage } from 'react-native-code-push';

export const useCodePush = () => {
  const [syncStateMessage, setStateSyncMessage] = useState('업데이트 확인 중...');
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
          optionalCodepushUpdate(update);
          break;
        default:
          break;
      }
    } catch (error) {
      console.info('checkCodePush Error', error);
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

          setStateSyncMessage('상큼함 다운로드 중...');
        })
        .then((newPackage: LocalPackage) => {
          // 다운로드 된 패키지 적용 중
          setStateSyncMessage('상큼함 업데이트 중...');
          newPackage.install(CodePush.InstallMode.ON_NEXT_RESTART).then(() => {
            // 패키지 적용 완료됐을때
            setStateSyncMessage('업데이트 완료!');
            setTimeout(() => {
              setIsCodePushUpdating(false);
              CodePush.restartApp(); // 앱 재시작
            }, 1000);
          });
        })
        .catch((error: any) => {
          console.info('update.download Error', error);
          setIsCodePushUpdating(false);
        });
    } catch (error) {
      Alert.alert('업데이트 중 에러가 발생했습니다.');
      console.info('forcedCodepushUpdate Error', error);
      setIsCodePushUpdating(false);
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
      setIsCodePushUpdating(false);
      console.info('optionalCodepushUpdate Error', error);
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
