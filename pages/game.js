import Head from "next/head";
import Image from "next/image";

export default function Game() {
  return (
    <>
      <Head>
        <meta name="description" content="description" />
      </Head>
      <div className="flex flex-col justify-center items-center">
        <div>
          <Image
            className="min-h-[100vh] backround-game"
            src="/images/pages/game/background.png"
            height={270}
            width={270}
            alt="space backround"
          />
          <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>
        </div>
      </div>
    </>
  );
}
