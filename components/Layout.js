import Head from "next/head";
import BackToTopButton from "../components/BackToTopButton";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <a href="#content" className="skip-to-main-content-link">
        Skip to main content
      </a>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        <meta name="p:domain_verify" content="155e6479dee7fb2c5ff84b2e5da8957f" />
        <meta name="p:domain_verify" content="b5004b976bb28d76591224d39f9edad0" />

        <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <header className="max-w-inner">
        <Navbar />
      </header>
      <main className="overflow-x-hidden w-full text-black" id="main">
        <div id="content" className="max-w-inner xxxl:px-0">
          {children}
        </div>
        <BackToTopButton />
        <Footer />
      </main>
    </>
  );
}
