import VersionCheck from 'react-native-version-check';

export const checkNeedUpdate = ({
  currentVersion,
  latestVersion,
}: {
  currentVersion: string;
  latestVersion: string;
}) => {
  return VersionCheck.needUpdate({
    depth: 2,
    currentVersion,
    latestVersion,
  });
};
