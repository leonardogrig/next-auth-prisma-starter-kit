import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }

  interface User {
    role: string | null;
    id: string | null;
    name: string;
    role: string | null;
    image: string | null;
    createdAt: Date;
  }
}
