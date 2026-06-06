import Layout from "../components/Layout";
import "../styles/styles.scss";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default function App({ Component, pageProps }) {
  return (
    <div className={roboto.variable}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}
