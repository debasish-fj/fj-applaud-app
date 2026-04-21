import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { googleLogin } from "@/app/lib/api";

declare module "next-auth" {
  interface Session {
    backendToken: string;
    isNewUser: boolean;
    error?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account }) {
      if (account?.provider === "google" && account.access_token) {
        try {
          const data = await googleLogin(account.access_token);
          console.log(data, "datatatatatatatatatat");
          // Stash on account so jwt callback can pick it up
          (account as Record<string, unknown>).backendToken = data.key;
          (account as Record<string, unknown>).isNewUser = data.is_new_user;
        } catch (err) {
          console.error("[auth] Backend Google login failed:", err);
          // Redirect back to login with error — user is NOT signed in
          return "/login?error=BackendUnavailable";
        }
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account?.provider === "google") {
        token.backendToken = (account as Record<string, unknown>).backendToken as string ?? "";
        token.isNewUser = (account as Record<string, unknown>).isNewUser as boolean ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      session.backendToken = (token.backendToken as string) ?? "";
      session.isNewUser = (token.isNewUser as boolean) ?? false;
      return session;
    },
  },
});
