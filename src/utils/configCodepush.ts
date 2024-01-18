import CodePush, { CodePushOptions } from 'react-native-code-push';

export const codePushOptions: CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL, // 지정한 때에 업데이트
  installMode: CodePush.InstallMode.IMMEDIATE,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
};
