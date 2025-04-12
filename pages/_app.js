import Layout from "../components/Layout";
import "../styles/styles.scss";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head></Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
