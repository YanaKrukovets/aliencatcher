import Head from "next/head";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Game() {
  const [spaceshipX, setSpaceshipX] = useState(245); // Centered initially (570px width container)
  const [rocks, setRocks] = useState([]); // Rocks falling
  const keys = useRef({ ArrowLeft: false, ArrowRight: false });
  const rockId = useRef(0);

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
      const touchX = e.touches[0].clientX;
      const screenWidth = window.innerWidth;
      const containerWidth = Math.min(screenWidth, 570);

      const containerStartX =
        screenWidth === containerWidth
          ? screenWidth / 2 - 80
          : (screenWidth - containerWidth) / 2;

      if (touchX < containerStartX + containerWidth / 2) {
        setSpaceshipX((x) => Math.max(0, x - 50));
      } else {
        setSpaceshipX((x) => Math.min(containerWidth - 80, x + 50));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("touchstart", handleTouchStart);
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

  useEffect(() => {
    const delays = [0, 7000, 15000, 34000, 50000]; // Customize timing for each rock

    delays.forEach((delay, index) => {
      setTimeout(() => {
        const side = index % 2 === 0 ? "left" : "right";
        const x = side === "left" ? -15 : 570 - 200;

        setRocks((prev) => [
          ...prev,
          {
            id: rockId.current++,
            side,
            x,
            y: -200,
            speed: 0.2,
          },
        ]);
      }, delay);
    });
  }, []);

  useEffect(() => {
    const move = () => {
      setRocks(
        (prevRocks) =>
          prevRocks
            .map((rock) => ({
              ...rock,
              y: rock.y + rock.speed,
            }))
            .filter((rock) => rock.y < window.innerHeight + 100) // Remove off-screen rocks
      );

      requestAnimationFrame(move); // Continue falling rocks
    };

    move(); // Start the continuous movement
  }, []);

  const disableRightClick = (e) => {
    e.preventDefault(); // Prevent the context menu from opening
  };

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
                  onContextMenu={disableRightClick} // Disable right-click on background
                />
              </div>
              <div className="w-full h-[100vh] relative">
                <Image
                  src="/images/pages/game/background1.png"
                  alt="space background"
                  fill
                  className="object-cover"
                  onContextMenu={disableRightClick} // Disable right-click on background
                />
              </div>
            </div>

            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[10]">
              <div id="stars"></div>
              <div id="stars2"></div>
              <div id="stars3"></div>
            </div>

            {/* Falling Rocks */}
            {rocks.map((rock) => (
              <div
                key={rock.id}
                className="absolute w-[220px] h-[100px] z-20"
                style={{
                  left: rock.x,
                  top: rock.y,
                  transition: "top 0.05s",
                }}
              >
                <Image
                  src={
                    rock.side === "left"
                      ? "/images/pages/game/rock-left.png"
                      : "/images/pages/game/rock-right.png"
                  }
                  alt="Rock"
                  fill
                  className="object-contain select-none pointer-events-none"
                  onContextMenu={disableRightClick} // Disable right-click on rock images
                />
              </div>
            ))}

            {/* Spaceship */}
            <div
              className="absolute bottom-4 w-20 h-20 z-20"
              style={{
                left: spaceshipX,
                transition: "left 0.1s",
              }}
            >
              {/* Glow effect */}
              <div
                className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-12 h-8 bg-white opacity-80 rounded-full animate-pulse"
                style={{
                  filter: "blur(4px)",
                  zIndex: -1,
                }}
              />

              {/* Spaceship Image */}
              <div className="relative w-full h-full">
                <Image
                  src="/images/pages/game/spaceship.png"
                  alt="Spaceship"
                  fill
                  className="object-contain"
                  onContextMenu={disableRightClick} // Disable right-click on spaceship
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
