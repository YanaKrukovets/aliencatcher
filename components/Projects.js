import React from "react";

import { Typewriter } from "react-simple-typewriter";

const Projects = () => {
  return (
    <div id="projects" className="purple py-[40px] font-roboto">
      <div className="max-w-wrapper px-5 mx-auto py-[20px]">
        <h2 className="pb-[10px] text-[27px]">
          <b>Current progress</b>
        </h2>

        <div className="projects-container flex-disp">
          <Typewriter
            words={["In Progress..."]}
            loop={true}
            cursor
            cursorStyle="_"
            typeSpeed={120}
            deleteSpeed={80}
            delaySpeed={950}
          />
        </div>
      </div>
    </div>
  );
};

export default Projects;
