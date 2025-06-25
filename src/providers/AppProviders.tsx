'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import AppContext from '@/contexts/AppContext';
import { UserAuth } from '@/types/auth.type';

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [auth, setAuth] = useState<UserAuth | undefined>(undefined);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setAuth({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        lastName: session.user.lastName,
        gender: session.user.gender,
        phoneNumber: session.user.phoneNumber,
        birthday: session.user.birthday,
        role: session.user.role,
        branchId: session.user.branchId,
        avatar: session.user.avatar,
        accessToken: session.user.accessToken,
      });
    } else if (status === 'unauthenticated') {
      setAuth(undefined);
    }
  }, [session, status]);

  return (
    <AppContext.Provider value={{ auth, setAuth }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProviders;