export type LoggedInUser = {
  email: string;
  enabled: 0 | 1;
  exp: number;
  iat: number;
  id: number;
  isCertified: 0 | 1;
  nickname: string;
};
