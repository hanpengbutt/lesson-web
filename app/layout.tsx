import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "교안 보관함", template: "%s | 교안 보관함" },
  description: "배우고, 실험하고, 직접 만들어 보는 코딩 수업 교안",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
