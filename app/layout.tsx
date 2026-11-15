import { getSiteUrl } from "@/lib/site-url";
import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "ESZI – Energetikai Technikum és Kollégium, Paks",
    template: "%s | ESZI Paks",
  },
  description:
    "Műszaki és gazdasági képzések Pakson. Ismerd meg az Energetikai Technikum és Kollégium képzéseit, közösségét és felvételi tudnivalóit.",
  openGraph: {
    locale: "hu_HU",
    type: "website",
    siteName: "ESZI Paks",
    images: [
      {
        url: "/images/campus.webp",
        width: 1185,
        height: 378,
        alt: "Az ESZI iskolaépülete Pakson",
      },
    ],
  },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#102a43",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body>
        <a href="#main" className="skip-link">
          Ugrás a tartalomra
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
