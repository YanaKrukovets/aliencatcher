import Head from "next/head";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Starfield from "../components/Starfield";

export default function Game() {
  const [spaceshipX, setSpaceshipX] = useState(245); // Centered initially (570px width container)
  const keys = useRef({ ArrowLeft: false, ArrowRight: false });
  const touchStartX = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        keys.current[e.key] = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        keys.current[e.key] = false;
      }
    };

    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      if (touchStartX.current === null) return;
      const touchEndX = e.touches[0].clientX;
      const diff = touchStartX.current - touchEndX;

      if (Math.abs(diff) > 30) {
        if (diff > 0) {
          // swipe left
          setSpaceshipX((x) => Math.max(0, x - 50));
        } else {
          // swipe right
          setSpaceshipX((x) => Math.min(570 - 80, x + 50)); // 570 container width - 80 spaceship width
        }
        touchStartX.current = null;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useEffect(() => {
    const move = () => {
      setSpaceshipX((x) => {
        if (keys.current.ArrowLeft) return Math.max(0, x - 5);
        if (keys.current.ArrowRight) return Math.min(570 - 80, x + 5);
        return x;
      });
      requestAnimationFrame(move);
    };
    move();
  }, []);

  return (
    <>
      <Head>
        <meta name="description" content="description" />
      </Head>
      <div>
        <div className="relative h-[100vh] overflow-hidden flex justify-center items-start">
          <div className="relative w-[570px] h-[100vh] overflow-hidden bg-black">
            {/* Background Scroll */}
            <div className="absolute top-0 left-0 w-full h-[200vh] scroll-vertical-loop">
              <div className="w-full h-[100vh] relative">
                <Image
                  src="/images/pages/game/background1.png"
                  alt="space background"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-full h-[100vh] relative">
                <Image
                  src="/images/pages/game/background1.png"
                  alt="space background"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[10]">
              <div id="stars"></div>
              <div id="stars2"></div>
              <div id="stars3"></div>
            </div>
            {/* Spaceship */}
            <div
              className="absolute bottom-4 w-20 h-20 z-20"
              style={{
                left: spaceshipX,
                transition: "left 0.1s",
              }}
            >
              <Image
                src="/images/pages/game/spaceship.png" // <-- Make sure you have this image
                alt="Spaceship"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
