"use client";

import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "p-8 font-mono text-sm",
          duration: 5000,
          ariaProps: {
            role: "status",
            "aria-live": "polite",
          },
        }}
      />
    </>
  );
}
