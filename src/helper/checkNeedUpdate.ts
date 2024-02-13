import VersionCheck from 'react-native-version-check';

export const checkNeedUpdate = async () => {
  return await VersionCheck.needUpdate({
    depth: 2,
  });
};
