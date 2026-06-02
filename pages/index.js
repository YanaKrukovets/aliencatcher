import About from "../components/About";
import AboutGame from "../components/AboutGame";
import Head from "next/head";

import ContactForm from "../components/Contact";
import HeaderBanner from "../components/HomeBanner";

export default function Home(props) {
  return (
    <>
      <Head>
        <title>
          Alifallx: Don&apos;t Leave Them Behind. Browser Game by Yana
          Krukovets.
        </title>
        <meta
          name="description"
          content="Alifallx: Don't Leave Them Behind. Browser Game by Yana Krukovets. Front-End Web Developer | Portfolio. Ottawa, Canada"
        />
      </Head>
      <div className="headerbanner">
        <HeaderBanner />
      </div>
      <div style={{ background: "linear-gradient(180deg, #1a0828 0%, #06091c 100%)", color: "#e8f4ff" }}>
        <AboutGame />
        <About />
        <ContactForm />
      </div>
    </>
  );
}
