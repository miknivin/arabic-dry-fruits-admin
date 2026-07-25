import { ReactNode } from "react";
import ReduxProvider from "@/components/ReduxProvider";
import MainContent from "@/components/MainContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arabic Dry Fruits Admin",
  description: "Arabic Dry Fruits Admin Dashboard",
  icons: {
    icon: "/arabic.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ReduxProvider>
          <MainContent>{children}</MainContent>
        </ReduxProvider>
      </body>
    </html>
  );
}
