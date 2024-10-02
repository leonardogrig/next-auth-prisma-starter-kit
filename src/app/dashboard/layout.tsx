import getSession from "@/auth";
import Header from "@/components/layout/header";
// import Sidebar from "@/components/layout/sidebar";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex antialiased">
      {/* <Sidebar /> */}
      <main className="w-full flex-1 overflow-hidden sm:px-20">
        <Header />
        {children}
      </main>
    </div>
  );
}
