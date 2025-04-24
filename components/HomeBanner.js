import React from "react";
import Navbar from "./Navbar";
import { Typewriter } from "react-simple-typewriter";
import Link from "next/link";

const HeaderBanner = () => {
  return (
    <>
      <div className="max-w-inner xxxl:px-0">
        <div className="max-w-wrapper px-5 mx-auto">
          <div
            className="text-center font-roboto welcome md:mt-[40%]"
            id="welcome"
          >
            <h1 className="text-[40px] mt-[25%] leading-[85px] md:text-[35px] md:leading-[60px] sm:text-[30px] sm:leading-[40px] md:mt-[30px]">
              <Typewriter
                words={[
                  "Hello there!",
                  "My name is Yana.",
                  "On this page, I am showing my progress on a browser game.",
                  "Welcome to Alien Catcher — A Cosmic Watercolor Adventure.",
                ]}
                loop={true}
                cursor
                cursorStyle="_"
                typeSpeed={120}
                deleteSpeed={80}
                delaySpeed={950}
              />
            </h1>
          </div>
          <div className="projects-container flex-disp">
            <Link class="my-work-btn sm:my-[20px]" href="/game">
              <span></span>
              <span></span>
              <span></span>
              <span></span>Game
            </Link>
          </div>
          <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>
        </div>
        <a href="#about">
          <div className="container">
            <div className="field">
              <div className="scroll"></div>
            </div>
          </div>
        </a>
      </div>
    </>
  );
};

export default HeaderBanner;
