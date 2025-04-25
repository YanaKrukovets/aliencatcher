import Head from "next/head";
import Image from "next/image";
import Starfield from "../components/Starfield";

export default function Game() {
  return (
    <>
      <Head>
        <meta name="description" content="description" />
      </Head>
      <div>
        <div className="relative h-[100vh] overflow-hidden flex justify-center items-start">
          <div className="relative w-[570px] h-[100vh] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[200vh] scroll-vertical-loop">
              {/* First image */}
              <div className="w-full h-[100vh]">
                <Image
                  src="/images/pages/game/background.png"
                  width={270}
                  height={540}
                  alt="space background"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Second identical image */}
              <div className="w-full h-[100vh]">
                <Image
                  src="/images/pages/game/background.png"
                  width={270}
                  height={540}
                  alt="space background"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <Starfield />
          </div>
        </div>
      </div>
    </>
  );
}
