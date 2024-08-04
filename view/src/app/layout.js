import Navbar from "@/components/Navbar/Navbar";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer/Footer";
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
        <StoreProvider>
          <div id="bgLayer">
                <Navbar />
                {children}
                <Footer />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
