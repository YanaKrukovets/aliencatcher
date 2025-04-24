import Head from "next/head";
import Image from "next/image";
import Starfield from "../components/Starfield";

export default function Game() {
  return (
    <>
      <Head>
        <meta name="description" content="description" />
      </Head>

      <div className="flex flex-col justify-center items-center">
        <Image
          className="mt-[90px] min-h-[70vh] w-auto"
          src="/images/pages/game/background.png"
          height={270}
          width={270}
          alt="space backround"
        />
        <Starfield />
      </div>
    </>
  );
}
