import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "New user",
};

type CreateUserLayoutProps = {
  children: ReactNode;
};

export default function CreateUserLayout({ children }: CreateUserLayoutProps) {
  return (
    <div className="min-h-screen bg-berkeleyBlue">
      <main>{children}</main>
    </div>
  );
}
