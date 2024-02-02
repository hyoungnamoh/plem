import VersionCheck from 'react-native-version-check';

export const getAppVersion = async () => {
  const currentVersion = VersionCheck.getCurrentVersion();
  const latestVersion = await VersionCheck.getLatestVersion();

  return {
    currentVersion,
    latestVersion,
  };
};
