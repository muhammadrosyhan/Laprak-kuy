import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "PraktiNote — Workspace Praktikum",
  description:
    "Susun laporan praktikum dengan screenshot dan penjelasan secara rapi.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
