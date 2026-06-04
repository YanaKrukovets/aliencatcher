import AboutGame from "../components/AboutGame";
import Head from "next/head";

import ContactForm from "../components/Contact";
import HeaderBanner from "../components/HomeBanner";

export default function Home(props) {
  return (
    <>
      <Head>
        <title>AlifallX: Don&apos;t Leave Them Behind — Browser Game by Yana Krukovets</title>
        <meta
          name="description"
          content="AlifallX: Don't Leave Them Behind. Catch falling aliens, dodge rocks, and survive increasingly wild levels. Free browser game by Yana Krukovets. Ottawa, Canada."
        />
        <link rel="canonical" href="https://www.alifallx.com/" />
        <meta property="og:url" content="https://www.alifallx.com/" />
        <meta property="og:title" content="AlifallX: Don't Leave Them Behind — Browser Game by Yana Krukovets" />
        <meta
          property="og:description"
          content="Catch falling aliens, dodge rocks, and survive increasingly wild levels. Free browser game by Yana Krukovets."
        />
        <meta property="og:image" content="https://www.alifallx.com/images/og-image.png" />
        <meta property="twitter:url" content="https://www.alifallx.com/" />
        <meta name="twitter:title" content="AlifallX: Don't Leave Them Behind — Browser Game by Yana Krukovets" />
        <meta
          name="twitter:description"
          content="Catch falling aliens, dodge rocks, and survive increasingly wild levels. Free browser game by Yana Krukovets."
        />
      </Head>
      <div className="headerbanner">
        <HeaderBanner />
      </div>
      <div className="bg-white">
        <AboutGame />
      </div>
      <div className="contact-wrapper">
        <ContactForm />
      </div>
    </>
  );
}
