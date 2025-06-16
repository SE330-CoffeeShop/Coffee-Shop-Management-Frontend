"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";
import { useRouter } from "next/navigation";
import { AppContext } from "@/contexts";
import { AuthType } from "@/types/auth.type";

const Header = () => {
  const { auth, setAuth } = useContext(AppContext) as AuthType;
  console.log("Auth: ", auth);
  const router = useRouter();

  const handleSignOut = () => {
    setAuth(undefined);

    // Delete the JWT cookie
    document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Redirect after signing out
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between bg-primary-0 px-4 drop-shadow md:px-6 font-montserrat">
      <div className="flex min-w-max flex-row items-center">
        <Image
          src="../icons/logo-bcoffee.svg"
          alt="logo"
          width={70}
          height={70}
        />
        <span className="text-2xl font-bold text-primary-700">BCOFFEE</span>
      </div>
      {auth ? (
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-base-semibold text-secondary-900">
              {auth?.name + " " + auth?.lastName}
            </span>
            <span className="capitalize text-secondary-900">{auth?.role}</span>
          </div>
          <Dropdown>
            <DropdownTrigger>
              <div
                className="h-10 w-10 rounded-full bg-primary-600 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${auth?.avatar})`,
                }}
              ></div>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Static Actions"
              className="bg-primary-700 text-primary-0"
            >
              {auth?.role == "NHÂN VIÊN" ? (
                <DropdownItem
                  key="myprofile"
                  onClick={() => router.replace("/employee/profile")}
                  className="hover:bg-primary-100 hover:text-primary-400"
                >
                  Thông tin cá nhân
                </DropdownItem>
              ) : (
                <DropdownItem
                  key="myprofile"
                  onClick={() => router.replace("/manager/profile")}
                  className="hover:bg-primary-100 hover:text-primary-400"
                >
                  Thông tin cá nhân
                </DropdownItem>
              )}
              <DropdownItem
                key="signout"
                onClick={handleSignOut}
                className="hover:bg-primary-100 hover:text-primary-400"
              >
                Đăng xuất
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      ) : (
        <div className="flex flex-row gap-2"></div>
      )}
    </header>
  );
};

export default Header;
