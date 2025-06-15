import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
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

  interface Session {
    user: {
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
    };
    expires: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
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
}