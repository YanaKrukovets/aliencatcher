import react from "react";
import Image from "next/image";

const Project = ({ href, src, alt, tech, text, year }) => {
  return (
    <div>
      <div className="project-card">
        <a href={href} target="_blank" rel="noreferrer">
          <div className="imageContainer">
            <Image
              src={src}
              alt={alt}
              height={230}
              width={330}
              className="image mb-[7px]"
            />

            <div className="overlay">
              <p>
                <b>VIEW</b>
              </p>
            </div>
          </div>
        </a>
        <div className="px-[10px]" role="button" tabIndex="0">
          <div className="flex justify-between leading-[19px]">
            <p className="text">{text}</p>
            <p>{year}</p>
          </div>
          <p className="tech">
            <b>Technologies:</b> {tech}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Project;
