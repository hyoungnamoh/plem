import CodePush, { CodePushOptions } from 'react-native-code-push';

export const codePushOptions: CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME, // 백그라운드에서 앱으로 돌아올 때마다 실행
  installMode: CodePush.InstallMode.IMMEDIATE,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
};
