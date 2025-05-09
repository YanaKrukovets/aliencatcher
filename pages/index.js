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
          Alien Catcher — A Cosmic Watercolor Adventure. Browser Game by Yana
          Krukovets.
        </title>
        <meta
          name="description"
          content="Alien Catcher — A Cosmic Watercolor Adventure. Browser Game by Yana Krukovets. Front-End Web Developer | Portfolio. Ottawa, Canada"
        />
      </Head>
      <div className="headerbanner">
        <HeaderBanner />
      </div>
      <div className="max-w-inner xxxl:px-0">
        <AboutGame />

        <About />
        <ContactForm />
      </div>
    </>
  );
}
