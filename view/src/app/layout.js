import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import StoreProvider from "./StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "E-Commerce App",
  description: "My Codecademy Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className={inter.className}>
        <div id="bgLayer">
          <StoreProvider>
              <Navbar />
              {children}
              <Footer />
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
