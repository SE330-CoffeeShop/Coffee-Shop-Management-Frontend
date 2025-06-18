export interface UserAuth {
  id: string;
  email: string;
  name: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  birthday: string;
  role: string;
  branchId: string;
  avatar: string;
  accessToken: string;
}

export type AuthType = {
  auth: UserAuth;
  setAuth: React.Dispatch<React.SetStateAction<UserAuth | undefined>>;
};