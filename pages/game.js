import Head from "next/head";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Game() {
  const [spaceshipX, setSpaceshipX] = useState(245);
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [spaceshipVisible, setSpaceshipVisible] = useState(true);
  const [centeringShip, setCenteringShip] = useState(false);
  const [rocksMoving, setRocksMoving] = useState(true);
  const keys = useRef({ ArrowLeft: false, ArrowRight: false });
  const rockId = useRef(0);
  const rockList = useRef([]);
  const [tick, setTick] = useState(0);
  const spaceshipRef = useRef(null);
  const containerWidth = 570;
  const centerX = (containerWidth - 80) / 2;

  // Disable right-click and long-press and prevent selection
  useEffect(() => {
    const preventContextMenu = (e) => e.preventDefault();
    const preventSelection = (e) => e.preventDefault();

    // Add touch event listeners with passive: false
    const touchOptions = { passive: false };
    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("touchstart", preventContextMenu, touchOptions);
    document.addEventListener("touchend", preventContextMenu, touchOptions);
    document.addEventListener("gesturestart", preventContextMenu, touchOptions);
    document.addEventListener("touchmove", preventContextMenu, touchOptions);

    // Prevent selection on all images
    document.addEventListener("selectstart", preventSelection);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("touchstart", preventContextMenu);
      document.removeEventListener("touchend", preventContextMenu);
      document.removeEventListener("gesturestart", preventContextMenu);
      document.removeEventListener("touchmove", preventContextMenu);
      document.removeEventListener("selectstart", preventSelection);
    };
  }, []);

  // Initialize spaceship position based on screen size
  useEffect(() => {
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth < 570;
    if (isMobile) {
      // Center the spaceship on mobile
      setSpaceshipX((screenWidth - 80) / 2);
    }
  }, []);

  // Handle keyboard and touch input
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
      if (centeringShip) return; // Don't allow movement during centering

      const touchX = e.touches[0].clientX;
      const screenWidth = window.innerWidth;
      const isMobile = screenWidth < 570;
      const containerWidth = isMobile ? screenWidth : 570;
      const containerStartX = isMobile ? 0 : (screenWidth - containerWidth) / 2;

      // Calculate movement based on touch position relative to screen center
      const screenCenter = screenWidth / 2;
      const moveAmount = 50; // Amount to move per touch

      if (touchX < screenCenter) {
        setSpaceshipX((x) => Math.max(0, x - moveAmount));
      } else {
        setSpaceshipX((x) => Math.min(containerWidth - 80, x + moveAmount));
      }
    };

    // Add touch event listeners with passive: false
    const touchOptions = { passive: false };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("touchstart", handleTouchStart, touchOptions);
    window.addEventListener(
      "touchmove",
      (e) => e.preventDefault(),
      touchOptions
    );
    window.addEventListener(
      "touchend",
      (e) => e.preventDefault(),
      touchOptions
    );

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", (e) => e.preventDefault());
      window.removeEventListener("touchend", (e) => e.preventDefault());
    };
  }, [centeringShip]);

  // Spaceship movement loop
  useEffect(() => {
    if (gameOver || centeringShip) return;

    const move = () => {
      setSpaceshipX((x) => {
        const screenWidth = window.innerWidth;
        const isMobile = screenWidth < 570;
        const containerWidth = isMobile ? screenWidth : 570;

        if (keys.current.ArrowLeft) return Math.max(0, x - 5);
        if (keys.current.ArrowRight)
          return Math.min(containerWidth - 80, x + 5);
        return x;
      });
      requestAnimationFrame(move);
    };
    move();
  }, [gameOver, centeringShip]);

  // Spawn rocks
  useEffect(() => {
    if (gameOver) return;

    const spawnDelays = [0, 7000, 18000, 38000, 50000];
    const startTime = performance.now();
    const spawned = new Set();
    const minVerticalSpacing = 150; // Minimum vertical space between rocks

    const spawnLoop = (now) => {
      const elapsed = now - startTime;
      spawnDelays.forEach((delay, index) => {
        if (elapsed >= delay && !spawned.has(index)) {
          const side = index % 2 === 0 ? "left" : "right";
          const screenWidth = window.innerWidth;
          const isMobile = screenWidth < 570;
          const containerWidth = isMobile ? screenWidth : 570;
          
          // Calculate base size and adjust for mobile
          let size;
          if (isMobile) {
            // On mobile, limit size to slightly less than half screen width
            const maxMobileWidth = (screenWidth * 0.45) / 220; // 220 is base rock width
            size = Math.min(0.8 + Math.random() * 0.4, maxMobileWidth);
          } else {
            size = 0.8 + Math.random() * 0.4;
          }
          
          const rockWidth = 220 * size;
          const rockHeight = 100 * size;
          
          // Adjust x position based on screen size and rock size
          let x;
          if (side === "left") {
            x = -15;
          } else {
            // Position right rocks closer to the right edge
            const rightOffset = -10; // Distance from right edge
            x = isMobile
              ? containerWidth - rockWidth - rightOffset
              : 570 - rockWidth - rightOffset;
          }

          // Check for vertical overlap with existing rocks
          const newRockY = -80;
          const hasOverlap = rockList.current.some((rock) => {
            const verticalDistance = Math.abs(rock.y - newRockY);
            return verticalDistance < minVerticalSpacing;
          });

          // Only spawn if there's no overlap
          if (!hasOverlap) {
            rockList.current.push({
              id: rockId.current++,
              side,
              x,
              y: newRockY,
              speed: 0.4,
              size,
              width: rockWidth,
              height: rockHeight,
              moving: true,
              collided: false,
            });
            spawned.add(index);
          }
        }
      });
      if (spawned.size < spawnDelays.length) {
        requestAnimationFrame(spawnLoop);
      }
    };

    requestAnimationFrame(spawnLoop);
  }, [gameOver]);

  // Rock animation + collision detection
  useEffect(() => {
    let animationFrame;

    const moveRocks = () => {
      const shipRect = {
        top: window.innerHeight - 80,
        bottom: window.innerHeight - 20,
        left: spaceshipX,
        right: spaceshipX + 80,
      };

      let collisionDetected = false;
      let collisionRockId = null;

      // First check for collisions
      rockList.current.forEach((rock) => {
        if (collisionDetected) return;

        const rockRect = {
          top: rock.y,
          bottom: rock.y + rock.height,
          left: rock.x,
          right: rock.x + rock.width,
        };

        const collided = !(
          rockRect.right < shipRect.left ||
          rockRect.left > shipRect.right ||
          rockRect.bottom < shipRect.top ||
          rockRect.top > shipRect.bottom
        );

        if (collided && !centeringShip && spaceshipVisible && !rock.collided) {
          // Record collision detection
          collisionDetected = true;
          collisionRockId = rock.id;

          setLives((prev) => {
            const next = prev - 1;
            return Math.max(0, next);
          });

          // Start centering animation
          setCenteringShip(true);
          // Stop all rocks from moving
          setRocksMoving(false);
        }
      });

      // Remove the rock that collided and update positions of the rest
      if (collisionDetected) {
        rockList.current = rockList.current.filter(
          (rock) => rock.id !== collisionRockId
        );
      }

      // Move all remaining rocks
      rockList.current = rockList.current.map((rock) => {
        // Skip movement if rocks aren't supposed to be moving globally
        if (!rocksMoving) {
          return rock;
        }

        const newY = rock.y + rock.speed;
        return { ...rock, y: newY };
      });

      // Only keep rocks that are still on screen
      rockList.current = rockList.current.filter(
        (rock) => rock.y < window.innerHeight + 100
      );

      setTick((t) => t + 1); // trigger re-render
      if (!gameOver) animationFrame = requestAnimationFrame(moveRocks);
    };

    if (!gameOver) animationFrame = requestAnimationFrame(moveRocks);
    return () => cancelAnimationFrame(animationFrame);
  }, [spaceshipX, gameOver, spaceshipVisible, rocksMoving, centeringShip]);

  // Center spaceship after each hit
  useEffect(() => {
    if (!centeringShip) return;

    // Animate to center
    const duration = 800;
    const startTime = performance.now();
    const startX = spaceshipX;
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth < 570;
    const targetX = isMobile ? (screenWidth - 80) / 2 : centerX;

    const centerAnimation = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function for smooth movement
      const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;

      const newX = startX + (targetX - startX) * easeProgress;
      setSpaceshipX(newX);

      if (progress < 1) {
        requestAnimationFrame(centerAnimation);
      } else {
        // Start blinking after centering is complete
        setIsBlinking(true);
      }
    };

    requestAnimationFrame(centerAnimation);
  }, [centeringShip, spaceshipX, centerX]);

  // Spaceship blinking effect after each hit
  useEffect(() => {
    if (isBlinking) {
      let blinkCount = 0;
      const maxBlinks = 4; // Reduced from 6 to 4 for less blinking time
      const blinkInterval = setInterval(() => {
        setSpaceshipVisible((prev) => !prev);
        blinkCount++;

        if (blinkCount >= maxBlinks) {
          clearInterval(blinkInterval);

          if (lives <= 0) {
            // If no lives left, hide the spaceship and end the game
            setSpaceshipVisible(false);
            setGameOver(true);
          } else {
            // If lives remain, keep the spaceship visible and resume the game
            setSpaceshipVisible(true);
            // Resume rock movement immediately after blinking completes
            setRocksMoving(true);
            setCenteringShip(false); // Allow the ship to be moved again
          }

          setIsBlinking(false);
        }
      }, 150); // Reduced from 200ms to 150ms for faster blinking

      return () => clearInterval(blinkInterval);
    }
  }, [isBlinking, lives]);

  return (
    <>
      <Head>
        <meta name="description" content="Game" />
        <style jsx global>{`
          img {
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -o-user-select: none;
            user-select: none;
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
          }
        `}</style>
      </Head>
      <div className="relative h-[100vh] overflow-hidden flex justify-center items-start">
        <div className="relative w-[570px] h-[100vh] overflow-hidden bg-black">
          {/* Background */}
          <div className="absolute top-0 left-0 w-full h-[200vh] scroll-vertical-loop">
            <div className="w-full h-[100vh] relative">
              <Image
                src="/images/pages/game/background1.png"
                alt="space background"
                fill
                className="object-cover select-none"
                draggable="false"
              />
            </div>
            <div className="w-full h-[100vh] relative">
              <Image
                src="/images/pages/game/background1.png"
                alt="space background"
                fill
                className="object-cover select-none"
                draggable="false"
              />
            </div>
          </div>

          {/* Stars Layer */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[10]">
            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>
          </div>

          {/* UI: Lives */}
          <div className="absolute top-4 left-4 text-white text-xl z-30">
            Lives: {lives}
          </div>

          {/* Game Over Screen */}
          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 text-white text-4xl font-bold">
              <p>Game Over</p>
              <p className="text-lg mt-4">Reload to try again</p>
            </div>
          )}

          {/* Rocks - Using image */}
          {rockList.current.map((rock) => (
            <div
              key={rock.id}
              className="absolute z-20"
              style={{
                left: rock.x,
                top: rock.y,
                width: rock.width,
                height: rock.height,
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
                draggable="false"
              />
            </div>
          ))}

          {/* Spaceship */}
          {spaceshipVisible && (
            <div
              ref={spaceshipRef}
              className="absolute bottom-4 w-20 h-20 z-20"
              style={{
                left: spaceshipX,
                transition: centeringShip ? "left 1s ease-in-out" : "left 0.1s",
                opacity: isBlinking ? (spaceshipVisible ? "1" : "0") : "1",
              }}
            >
              <div
                className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-12 h-8 bg-white opacity-80 rounded-full animate-pulse"
                style={{
                  filter: "blur(4px)",
                  zIndex: -1,
                }}
              />
              <div className="relative w-full h-full">
                <Image
                  src="/images/pages/game/spaceship.png"
                  alt="Spaceship"
                  fill
                  className="object-contain select-none"
                  draggable="false"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
