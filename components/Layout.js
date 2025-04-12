/* eslint-disable @next/next/next-script-for-ga */
import Head from "next/head";
import React, { useEffect, useState } from "react";
import BackToTopButton from "../components/BackToTopButton";
import HeaderBanner from "./HomeBanner";

import Footer from "./Footer";

export default function Layout({ children }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(
      typeof window !== "undefined"
        ? window.location.protocol + "//" + window.location.hostname
        : ""
    );
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        <meta property="og:url" content="http://yanakrukovets.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Yana Krukovets Portfolio" />
        <meta
          property="og:description"
          content="Yana Krukovets. Front-end web developer. HTML, CSS, JavaScript, ReactJS, Next.js, Tailwind.css, jQuery,
          Bootstrap, Wordpress, Tilda, Sanity, Liquid script, PHP, mySQL"
        />
        <meta property="og:image" content="/images/og-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="yanakrukovets.com" />
        <meta property="twitter:url" content="https://www.yanakrukovets.com/" />
        <meta name="twitter:title" content="Yana Krukovets Portfolio" />
        <meta
          name="twitter:description"
          content="Yana Krukovets. Front-end web developer. HTML, CSS, JavaScript, ReactJS, Next.js, Tailwind.css, jQuery,
          Bootstrap, Wordpress, Tilda, Sanity, Liquid script, PHP, mySQL"
        />
        <meta
          name="twitter:image"
          content="http://yanakrukovets.com/images/og-image.png"
        />

        <meta
          name="p:domain_verify"
          content="155e6479dee7fb2c5ff84b2e5da8957f"
        />

        <meta
          name="p:domain_verify"
          content="b5004b976bb28d76591224d39f9edad0"
        />

        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="http://yanakrukovets.com/apple-touch-icon.png"
        />

        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="https://www.yanakrukovets.com/favicon.ico" />
      </Head>
      <header className="max-w-inner">
        <HeaderBanner />
      </header>
      <main className={`verflow-x-hidden w-full text-black`} id="main">
        <a href="#main" className="skip-to-main-content-link">
          Skip to main content
        </a>

        <div id="content" className="max-w-inner xxxl:px-0">
          {children}
        </div>
        <BackToTopButton />
        <Footer />
      </main>
    </>
  );
}
