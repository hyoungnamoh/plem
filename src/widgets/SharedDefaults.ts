import { NativeModules } from 'react-native';

const NativeSharedDefaults = NativeModules.SharedDefaults;

class SharedDefaults {
  // 업데이트 해줘야 타임라인을 다시 만듦, 업데이트 함수 호출 시 바로 다시 만드는 건 아니고
  // 앱이 백그라운드로 갈 때 업데이트를 모았다가 최적화?해서 한 번에 실행함
  public async updateDoItNowBridge() {
    try {
      const res: boolean = await NativeSharedDefaults.updateDoItNow('');
      return res;
    } catch (e) {
      console.warn('updateDoItNowBridge Error', e);
      return false;
    }
  }

  public async setTokenBridge(token: string | null) {
    try {
      const res: boolean = await NativeSharedDefaults.setToken(token);
      return res;
    } catch (e) {
      console.warn('setTokenBridge Error', e);
      return false;
    }
  }
}

export default new SharedDefaults();
