import { atom } from 'recoil';
import { LoggedInUser } from '../../types/user';

export const loggedInUserState = atom<null | LoggedInUser>({
  key: 'loggedInUser',
  default: null,
});
