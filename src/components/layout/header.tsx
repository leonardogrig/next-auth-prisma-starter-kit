"use client";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";
// import { MobileSidebar } from "./mobile-sidebar";
import { ThemeToggler } from "./theme-toggler";
import UserButton from "./user-button";

export default function Header() {
  const session = useSession();
  const user = session?.data?.user;

  return (
    <header className="sticky inset-x-0 py-4 pr-10 w-full border-b-2">
      <nav className="flex items-center justify-between px-4 py-2 md:justify-end">
        <div className={cn("block md:!hidden")}>{/* <MobileSidebar /> */}</div>
        <div className="flex items-center gap-4">
          <ThemeToggler />

          {user ? <UserButton user={user} /> : <SignInButton />}
        </div>
      </nav>
    </header>
  );
}

function SignInButton() {
  return (
    <Button variant={"outline"} asChild>
      <Link href="/auth/signin">Sign in with Google</Link>
    </Button>
  );
}
