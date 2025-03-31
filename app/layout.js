import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700']
});

export const metadata = {
  title: "Zafer Home",
  description: "Zafer Home Yönetim Paneli",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
} 