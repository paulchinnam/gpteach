//"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { FirebaseProvider } from "./hooks/useFirebase";
import { Suspense } from "react";
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <FirebaseProvider>
      <html lang="en">
        <body>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </body>
      </html>
    </FirebaseProvider>
  );
}
