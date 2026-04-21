import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Landing | Inscription",
  description: "Landing page simple avec formulaire connecté à Google Sheets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
