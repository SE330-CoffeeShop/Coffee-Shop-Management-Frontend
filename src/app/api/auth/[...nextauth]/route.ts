import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { getFcmToken } from "../../../../lib/firebase";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        const { email, password } = credentials;

        const loginRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" },
          }
        );
        const loginData = await loginRes.json();

        if (!loginRes.ok || !loginData.data) {
          console.error("Login failed:", loginData);
          return null;
        }

        const { accessToken, id, role } = loginData.data;

        if (
          typeof accessToken !== "string" ||
          typeof id !== "string" ||
          typeof role !== "string"
        ) {
          console.error("Invalid login data:", loginData.data);
          return null;
        }

        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/account/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const userData = await userRes.json();

        if (!userRes.ok || !userData.data) {
          console.error("Failed to fetch user data:", userData);
          return null;
        }

        const {
          email: userEmail,
          name,
          lastName,
          gender,
          phoneNumber,
          birthday,
          branchId,
          avatar,
        } = userData.data;

        // Kiểm tra các trường bắt buộc
        // branchId chỉ bắt buộc với role NHÂN VIÊN và QUẢN Lờ, không bắt buộc với QUẢN TRỊ VIÊN
        if (
          typeof userEmail !== "string" ||
          typeof name !== "string" ||
          typeof lastName !== "string" ||
          typeof gender !== "string" ||
          typeof phoneNumber !== "string" ||
          typeof birthday !== "string" ||
          typeof avatar !== "string" ||
          (role !== "QUẢN TRỊ VIÊN" && typeof branchId !== "string") // branchId chỉ bắt buộc với role khác QUẢN TRỊ VIÊN
        ) {
          console.error("Invalid user data:", userData.data);
          return null;
        }

        return {
          id,
          email: userEmail,
          name,
          lastName,
          gender,
          phoneNumber,
          birthday,
          role,
          branchId: branchId || "", // Gán giá trị rỗng nếu branchId là undefined
          avatar,
          accessToken,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async jwt({ token, user }) {
      const cookieStore = await cookies();

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.lastName = user.lastName;
        token.gender = user.gender;
        token.phoneNumber = user.phoneNumber;
        token.birthday = user.birthday;
        token.role = user.role;
        token.branchId = user.branchId;
        token.avatar = user.avatar;
        token.accessToken = user.accessToken;

        cookieStore.set("jwt", user.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });

        // Chỉ gọi getFcmToken client-side
        if (typeof window !== "undefined") {
          try {
            const fcmToken = await getFcmToken();
            if (fcmToken && process.env.NEXT_PUBLIC_SERVER_URL) {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/notification/register`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.accessToken}`,
                  },
                  body: JSON.stringify({ token: fcmToken }),
                }
              );
              if (!response.ok) {
                console.error(
                  "Failed to register FCM token:",
                  await response.text()
                );
              } else {
                console.log("FCM token registered successfully");
              }
            }
          } catch (err) {
            console.error("Error sending FCM token:", err);
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          lastName: token.lastName,
          gender: token.gender,
          phoneNumber: token.phoneNumber,
          birthday: token.birthday,
          role: token.role,
          branchId: token.branchId,
          avatar: token.avatar,
          accessToken: token.accessToken,
        };
      }
      session.expires = new Date(
        Date.now() + 1 * 3 * 60 * 60 * 1000
      ).toISOString();
      return session;
    },
  },
  pages: {
    signIn: "/auth/signIn",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };