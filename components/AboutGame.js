import React from "react";

const AboutGame = () => {
  return (
    <div id="aboutgame" className="py-[40px] font-roboto">
      <div className="max-w-wrapper px-5 mx-auto py-[20px] max-w-[65%] md:max-w-full">
        <h2 className="pb-[10px] text-[27px]">
          <b>Alien Catcher — A Cosmic Watercolor Adventure</b>
        </h2>
        <p className="mt-[10px]">
          Step into the colorful cosmos in Alien Catcher, a charming
          hand-painted browser game where you pilot a quirky spaceship on a
          mission to rescue wayward aliens scattered across the stars!
        </p>
        <p className="mt-[10px]">
          Navigate your nimble craft left and right as adorable aliens tumble
          down from planets and asteroids above. Your goal? Catch as many of
          them as you can before they float off into the void! And be careful
          with asteroids!
        </p>
        <p className="mt-[10px]">
          Each alien is uniquely illustrated in soft watercolor hues, bursting
          with personality—from giggling green blobs to sleepy purple fuzzballs.
          The dreamy galaxy background and playful sound effects will transport
          you to a universe where every save feels like a mini miracle.
        </p>

        <h3 className="py-[10px] text-[20px] mt-[10px]">
          <b>Features:</b>
        </h3>
        <ul className="list-disc list-inside pl-[15px]">
          <li>Hand-painted watercolor visuals that bring space to life</li>
          <li>Simple, intuitive controls (arrow keys or touchscreen swipes)</li>
          <li>Peaceful, ambient soundtrack for a relaxing arcade experience</li>
          <li>Collectible alien types with fun bios and animations</li>
        </ul>
        <p className="mt-[15px]">
          Whether you&apos;re a casual explorer or a cosmic champion, Alien
          Catcher will pull you into a magical world where every catch counts.
        </p>
      </div>
    </div>
  );
};

export default AboutGame;
