import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "LeadDesk",
  description: "Lead capture platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}