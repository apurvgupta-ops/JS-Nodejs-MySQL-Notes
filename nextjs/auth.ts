import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "./lib/connectDb";
import Auth from "./models/authModel";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        console.log("Credentials authorize - credentials:", credentials);

        try {
          await connectDB();

          const user = await Auth.findOne({ email: credentials.email });

          if (!user) {
            console.log("User not found");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordValid) {
            console.log("Invalid password");
            return null;
          }

          console.log("User authenticated:", user);
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.username,
            image: user.image || null,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async signIn({ user, account }: any) {
      console.log("SignIn Callback - user:", user, "account:", account);

      try {
        await connectDB();
        console.log("Database connected");

        const existingUser = await Auth.findOne({ email: user.email });
        console.log("Existing user:", existingUser);

        if (!existingUser) {
          console.log("inside existing");
          const newUser = await Auth.create({
            email: user.email,
            username: user.name || user.email?.split("@")[0],
            image: user.image,
          });
          console.log("New user created:", newUser);
        }

        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },

    async jwt({ token, account, user }: any) {
      console.log("JWT Callback - user:", user, "account:", account);

      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }

      console.log("JWT Token:", token);
      return token;
    },

    async session({ session, token }: any) {
      console.log("Session Callback - token:", token);

      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
      }

      console.log("Session Object:", session);
      return session;
    },

    async redirect({ url, baseUrl }: any) {
      console.log("Redirect callback - url:", url, "baseUrl:", baseUrl);
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
});
