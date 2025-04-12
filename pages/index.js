import About from "../components/About";
import AboutGame from "../components/AboutGame";
import Head from "next/head";
import Projects from "../components/Projects";
import ContactForm from "../components/Contact";

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
      <div className="max-w-inner xxxl:px-0">
        <AboutGame />
        <Projects />
        <About />
        <ContactForm />
      </div>
    </>
  );
}
