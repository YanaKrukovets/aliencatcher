import React from "react";

const AboutGame = () => {
  return (
    <section id="aboutgame" className="about-game font-roboto py-[60px]">
      <div>
        <div className="max-w-wrapper px-5 mx-auto py-[20px] max-w-full md:max-w-[65%]">
          <h2 className="section-heading-blue pb-[10px] text-[27px]">
            <b>AlifallX: Don&apos;t Leave Them Behind</b>
          </h2>
          <p className="mt-[10px]">
            AlifallX is an arcade browser game where you pilot a spaceship and fight to rescue
            stranded aliens before they fall into the void. Rocks drift down from above — aliens
            walk to the edge and drop off, and it&apos;s your job to catch them. But space is not
            a friendly place, and things get wild fast.
          </p>
          <p className="mt-[10px]">
            As you climb through levels, the chaos ramps up: UFOs cross the screen firing tractor
            beams, upside-down aliens rise from below, gravity wells warp your flight path, and
            bomb aliens fall to steal your lives. Collect coins, buy bullets, and keep your ship
            flying — every alien saved counts.
          </p>

          <h3 className="section-heading-blue py-[10px] text-[20px] mt-[10px]">
            <b>How to Play — Keyboard:</b>
          </h3>
          <ul className="list-disc list-inside pl-[15px]">
            <li><b>← → / A / D</b> — move your ship left and right</li>
            <li><b>Space</b> — shoot; blast rocks and enemies out of the way</li>
            <li><b>S</b> — activate a meteor shield (blocks the next meteor storm hit)</li>
            <li><b>P / Escape</b> — pause and resume the game</li>
            <li><b>1</b> — buy 30 bullets for 🪙100</li>
            <li><b>2</b> — buy 1 shield for 🪙70</li>
            <li><b>3</b> — buy 1 extra life for 🪙200</li>
            <li>Catch falling aliens with your ship to earn points and coins</li>
            <li>You start with 3 lives and 2 shields — lose all lives and it&apos;s game over</li>
          </ul>

          <h3 className="section-heading-blue py-[10px] text-[20px] mt-[10px]">
            <b>How to Play — Mobile:</b>
          </h3>
          <p className="mt-[4px] mb-[8px]">
            The game is fully playable on phones — on-screen touch buttons appear automatically when you start playing.
          </p>
          <ul className="list-disc list-inside pl-[15px]">
            <li><b>← (left button)</b> — hold to move your ship left</li>
            <li><b>→ (right button)</b> — hold to move your ship right</li>
            <li><b>🔫 (fire button)</b> — tap and hold to auto-fire continuously</li>
            <li><b>🛡 (shield button)</b> — tap to activate your meteor shield</li>
            <li>Buying bullets, shields, and lives is not available on mobile — earn coins by catching and shooting aliens</li>
          </ul>

          <h3 className="section-heading-blue py-[10px] text-[20px] mt-[10px]">
            <b>Things You&apos;ll Encounter:</b>
          </h3>
          <ul className="list-disc list-inside pl-[15px]">
            <li><b>Rocks</b> — fall from the top; aliens walk off the edges and drop. Boss rocks at higher levels take 5 hits</li>
            <li><b>Meteor Storm</b> — a barrage of meteors rains down; one zone is safe — read the warning and move there</li>
            <li><b>UFO</b> — flies across the screen firing a tractor beam that abducts your aliens; shoot it down (15 HP) for 🪙400</li>
            <li><b>Reverse Alien</b> — rises from the bottom upside-down; shoot it before it escapes for 🪙25</li>
            <li>❤️ <b>Heart Alien</b> (level 4+) — catch it to gain an extra life</li>
            <li>🛡️ <b>Shield Alien</b> (level 3+) — catch it to gain an extra meteor shield charge</li>
            <li>💣 <b>Bomb Alien</b> (level 7+) — avoid it! Touching it costs you 1 life</li>
            <li><b>Gravity Well</b> — a black hole that drifts across the arena and pulls your ship off course</li>
            <li><b>Scramble</b> — a hazard that briefly flips your left and right controls</li>
            <li><b>The Last Egg</b> — a giant egg that falls from the sky at level 50; catch it to complete the mission</li>
          </ul>

          <h3 className="section-heading-blue py-[10px] text-[20px] mt-[10px]">
            <b>Level Progression:</b>
          </h3>
          <ul className="list-disc list-inside pl-[15px]">
            <li>Levels 1–9: catch <b>5 aliens</b> to advance</li>
            <li>Levels 10–14: catch <b>7 aliens</b> to advance</li>
            <li>Levels 15–19: catch <b>10 aliens</b> to advance</li>
            <li>Level 20+: catch <b>15 aliens</b> to advance</li>
            <li>Each level brings faster rocks, tighter spawns, and new threats</li>
          </ul>

          <h3 className="section-heading-blue py-[10px] text-[20px] mt-[10px]">
             <b>Features:</b>
          </h3>
          <ul className="list-disc list-inside pl-[15px]">
            <li>Dynamic difficulty — speed, spawn rates, and color palettes scale with level</li>
            <li>Coin economy — earn, save, and spend mid-game</li>
            <li>Pause anytime with <b>P</b> or the ⏸ button in the HUD</li>
            <li>Animated canvas visuals with particles, fireworks, and glowing effects</li>
            <li>Sound effects and music that react to gameplay events</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutGame;
