'use client'

import React, { useState } from "react";
import { UserAuth } from "@/types/auth.type";
import AppContext from "@/contexts/AppContext";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<UserAuth | undefined>(undefined);

  return (
    <AppContext.Provider value={{ auth, setAuth }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProviders;
