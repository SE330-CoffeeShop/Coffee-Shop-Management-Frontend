export type UserAuth = {
  id: string;
  branchId: string;
  name: string;
  accessToken: string;
  role: string;
  avatar: string;
};

export type AuthType = {
  auth: UserAuth;
  setAuth: React.Dispatch<React.SetStateAction<UserAuth | undefined>>;
};