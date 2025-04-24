import Head from "next/head";
import Image from "next/image";
import Starfield from "../components/Starfield";

export default function Game() {
  return (
    <>
      <Head>
        <meta name="description" content="description" />
      </Head>

      <div className="flex flex-col justify-center items-center h-full">
        <Image
          className="mt-[100px] min-h-[80vh] w-auto mb-[15px]"
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
