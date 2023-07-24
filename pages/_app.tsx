// pages/_app.tsx

import Navbar from "@/components/Navbar ";
import "../styles/globals.css";
import '../styles/homePageStyles.css';
import type { AppProps } from "next/app";
import { Inter} from 'next/font/google';
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer ";
import NextProgress from "next-progress";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (  
    <main className={inter.className}>
      <Head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </Head>
      <NextProgress delay={200} color="#8922dd" options={{ showSpinner: false }}/>
      <Toaster/>
      <Navbar />
      <Component {...pageProps} />
      {/* <Footer/> */}
    </main>
  );
}
